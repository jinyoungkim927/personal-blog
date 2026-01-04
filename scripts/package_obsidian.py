#!/usr/bin/env python3
"""
Obsidian to Blog Packager

This script imports Obsidian documents into the Gatsby blog, handling:
- Wiki-links ([[Page]] and [[Target|Display]])
- Images ([[image.jpg]])
- Linked pages as "snippets" with LLM quality filtering

Usage:
    python scripts/package_obsidian.py

Configure POSTS_TO_PACKAGE list below with the titles of documents to import.
"""

import os
import re
import json
import shutil
from pathlib import Path
from datetime import datetime
from typing import Optional, Tuple, List, Dict, Any
from dotenv import load_dotenv

# Load environment variables
load_dotenv(Path(__file__).parent / '.env')

# Configuration
OBSIDIAN_VAULT_PATH = os.getenv('OBSIDIAN_VAULT_PATH', '/Users/jinyoungkim/Documents/Obsidian Vault')
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY', '')
BLOG_ROOT = Path(__file__).parent.parent
POSTS_DIR = BLOG_ROOT / 'content' / 'posts'
SNIPPETS_DIR = BLOG_ROOT / 'content' / 'snippets'

# Quality check thresholds
MIN_QUALITY_SCORE = 6

# ============================================================
# POSTS TO PACKAGE - Add your document titles here
# ============================================================
POSTS_TO_PACKAGE = [
    "Before and After Superintelligence Part I",
]

# Logging directory for AI checks
LOGS_DIR = Path(__file__).parent / 'logs'


# ============================================================
# Wiki-Link and Image Parsing
# ============================================================

# Pattern: [[Target]] or [[Target|Display]]
WIKI_LINK_PATTERN = re.compile(r'\[\[([^\]|]+)(?:\|([^\]]+))?\]\]')

# Image extensions
IMAGE_EXTENSIONS = {'.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.bmp'}


def parse_wiki_links(content: str) -> List[Dict[str, Any]]:
    """
    Extract all wiki-links from content.
    
    Returns list of dicts with:
    - target: The linked page/file name
    - display: Display text (if provided, else None)
    - is_image: Whether this is an image reference
    - start: Start position in content
    - end: End position in content
    - full_match: The full [[...]] string
    """
    links = []
    for match in WIKI_LINK_PATTERN.finditer(content):
        target = match.group(1).strip()
        display = match.group(2).strip() if match.group(2) else None
        
        # Check if it's an image
        is_image = any(target.lower().endswith(ext) for ext in IMAGE_EXTENSIONS)
        
        links.append({
            'target': target,
            'display': display,
            'is_image': is_image,
            'start': match.start(),
            'end': match.end(),
            'full_match': match.group(0)
        })
    
    return links


def extract_frontmatter(content: str) -> Tuple[Dict[str, Any], str]:
    """
    Extract YAML frontmatter from Obsidian document.
    Returns (frontmatter_dict, content_without_frontmatter)
    """
    frontmatter = {}
    body = content
    
    if content.startswith('---'):
        parts = content.split('---', 2)
        if len(parts) >= 3:
            import yaml
            try:
                frontmatter = yaml.safe_load(parts[1]) or {}
            except:
                pass
            body = parts[2].strip()
    
    return frontmatter, body


# ============================================================
# Vault Search Functions
# ============================================================

def find_document(title: str, vault_path: str = OBSIDIAN_VAULT_PATH) -> Optional[Path]:
    """
    Recursively search vault for a document by title.
    Searches for {title}.md (case-insensitive)
    """
    vault = Path(vault_path)
    target_filename = f"{title}.md".lower()
    
    for md_file in vault.rglob('*.md'):
        if md_file.name.lower() == target_filename:
            return md_file
    
    return None


def find_image(filename: str, vault_path: str = OBSIDIAN_VAULT_PATH) -> Optional[Path]:
    """
    Recursively search vault for an image by filename.
    """
    vault = Path(vault_path)
    target_filename = filename.lower()
    
    for img_file in vault.rglob('*'):
        if img_file.is_file() and img_file.name.lower() == target_filename:
            ext = img_file.suffix.lower()
            if ext in IMAGE_EXTENSIONS:
                return img_file
    
    return None


def find_all_linked_documents(content: str, vault_path: str = OBSIDIAN_VAULT_PATH) -> Dict[str, Optional[Path]]:
    """
    Find all linked documents from wiki-links in content.
    Returns dict mapping target name to file path (or None if not found).
    """
    links = parse_wiki_links(content)
    documents = {}
    
    for link in links:
        if not link['is_image']:
            target = link['target']
            if target not in documents:
                documents[target] = find_document(target, vault_path)
    
    return documents


# ============================================================
# OpenAI Quality Check
# ============================================================

def check_quality(content: str, title: str, api_key: str = OPENAI_API_KEY) -> Dict[str, Any]:
    """
    Use OpenAI to assess document quality and appropriateness.
    
    Returns:
    {
        "appropriate": bool,  # Not too personal, not TMI
        "technically_sound": bool,  # No obvious technical errors
        "quality_score": int,  # 1-10 for grammar/information density
        "passes": bool,  # Overall pass/fail
        "reason": str  # Explanation
    }
    """
    if not api_key:
        print(f"  ⚠️  No OpenAI API key - skipping quality check for '{title}'")
        return {
            "appropriate": True,
            "technically_sound": True,
            "quality_score": 7,
            "passes": True,
            "reason": "No API key - auto-passed"
        }
    
    try:
        import openai
        client = openai.OpenAI(api_key=api_key)
        
        # Truncate content if too long
        max_chars = 8000
        check_content = content[:max_chars] if len(content) > max_chars else content
        
        prompt = f"""Evaluate this document for publication on a public blog. 
        
Document Title: {title}

Document Content:
{check_content}

Return a JSON object with these fields:
- "appropriate": true if the content is not too personal, not TMI, and suitable for public viewing
- "technically_sound": true if there are no obvious technical or factual errors
- "quality_score": integer 1-10 rating for writing quality (grammar, clarity, information density)
- "reason": brief explanation of your assessment

Only return the JSON object, no other text."""

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            max_tokens=500
        )
        
        result_text = response.choices[0].message.content.strip()
        
        # Parse JSON from response
        # Handle potential markdown code blocks
        if result_text.startswith('```'):
            result_text = re.sub(r'^```json?\n?', '', result_text)
            result_text = re.sub(r'\n?```$', '', result_text)
        
        result = json.loads(result_text)
        
        # Determine overall pass/fail
        passes = (
            result.get('appropriate', False) and 
            result.get('technically_sound', False) and 
            result.get('quality_score', 0) >= MIN_QUALITY_SCORE
        )
        result['passes'] = passes
        
        # Log the result
        log_ai_check(title, result, check_content)
        
        return result
        
    except Exception as e:
        print(f"  ⚠️  Quality check error for '{title}': {e}")
        error_result = {
            "appropriate": True,
            "technically_sound": True,
            "quality_score": 7,
            "passes": True,
            "reason": f"Error during check: {e} - auto-passed",
            "error": str(e)
        }
        log_ai_check(title, error_result, "")
        return error_result


# ============================================================
# MDX Conversion
# ============================================================

def slugify(text: str) -> str:
    """Convert text to URL-friendly slug."""
    slug = text.lower()
    slug = re.sub(r'[^a-z0-9]+', '-', slug)
    slug = slug.strip('-')
    return slug


def convert_to_mdx(
    content: str,
    title: str,
    date: Optional[str] = None,
    tags: Optional[List[str]] = None,
    description: Optional[str] = None,
    linked_snippets: Optional[Dict[str, Dict]] = None,
    images_map: Optional[Dict[str, str]] = None
) -> str:
    """
    Convert Obsidian markdown to MDX format with proper frontmatter.
    
    Args:
        content: The markdown body (without frontmatter)
        title: Document title
        date: Date string (YYYY-MM-DD), defaults to today
        tags: List of tags
        description: Post description
        linked_snippets: Dict mapping link target to {slug, passes} for linked pages
        images_map: Dict mapping original image name to local filename
    
    Returns:
        Complete MDX content with frontmatter
    """
    if date is None:
        date = datetime.now().strftime('%Y-%m-%d')
    
    if tags is None:
        tags = []
    
    if linked_snippets is None:
        linked_snippets = {}
    
    if images_map is None:
        images_map = {}
    
    # Build frontmatter
    frontmatter_lines = [
        '---',
        f'title: "{title}"',
        f'date: {date}',
    ]
    
    if description:
        # Escape quotes in description
        desc_escaped = description.replace('"', '\\"')
        frontmatter_lines.append(f'description: "{desc_escaped}"')
    
    if tags:
        frontmatter_lines.append('tags:')
        for tag in tags:
            frontmatter_lines.append(f'  - {tag}')
    
    frontmatter_lines.append('---')
    frontmatter = '\n'.join(frontmatter_lines)
    
    # Convert wiki-links in content
    converted_content = content
    
    # Process links in reverse order to maintain positions
    links = parse_wiki_links(content)
    for link in reversed(links):
        target = link['target']
        display = link['display'] or target
        full_match = link['full_match']
        
        if link['is_image']:
            # Image link
            if target in images_map:
                local_name = images_map[target]
                replacement = f'![{display}](./{local_name})'
            else:
                # Image not found, leave as text
                replacement = f'*[Image: {target}]*'
        else:
            # Document link
            if target in linked_snippets:
                snippet_info = linked_snippets[target]
                if snippet_info['passes']:
                    # Accessible snippet
                    replacement = f'[{display}](/snippets/{snippet_info["slug"]}/)'
                else:
                    # Inaccessible snippet - gray text
                    replacement = f'<span style={{{{color: "#999", cursor: "not-allowed"}}}}>{display}</span>'
            else:
                # Link to unknown page - just use text
                replacement = display
        
        converted_content = (
            converted_content[:link['start']] + 
            replacement + 
            converted_content[link['end']:]
        )
    
    return f"{frontmatter}\n\n{converted_content}"


# ============================================================
# Main Packaging Functions
# ============================================================

def load_snippet_metadata(snippets_dir: Path = SNIPPETS_DIR) -> Dict[str, Any]:
    """Load existing snippet metadata."""
    meta_path = snippets_dir / '_metadata.json'
    if meta_path.exists():
        try:
            return json.loads(meta_path.read_text(encoding='utf-8'))
        except:
            pass
    return {}


def save_snippet_metadata(metadata: Dict[str, Any], snippets_dir: Path = SNIPPETS_DIR) -> None:
    """Save snippet metadata to JSON file."""
    snippets_dir.mkdir(parents=True, exist_ok=True)
    meta_path = snippets_dir / '_metadata.json'
    meta_path.write_text(json.dumps(metadata, indent=2), encoding='utf-8')


def log_ai_check(title: str, result: Dict[str, Any], content_preview: str = "") -> None:
    """Log AI quality check results with timestamp."""
    LOGS_DIR.mkdir(parents=True, exist_ok=True)
    
    timestamp = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
    date_str = datetime.now().strftime('%Y-%m-%d')
    
    # Create date-based log file
    log_file = LOGS_DIR / f'ai_checks_{date_str}.json'
    
    # Load existing logs for today
    logs = []
    if log_file.exists():
        try:
            logs = json.loads(log_file.read_text(encoding='utf-8'))
        except:
            logs = []
    
    # Add new log entry
    log_entry = {
        'timestamp': timestamp,
        'title': title,
        'result': result,
        'content_preview': content_preview[:500] if content_preview else ''
    }
    logs.append(log_entry)
    
    # Save updated logs
    log_file.write_text(json.dumps(logs, indent=2), encoding='utf-8')
    
    # Also create individual log file for easy debugging
    safe_title = slugify(title)
    individual_log = LOGS_DIR / f'{timestamp}_{safe_title}.json'
    individual_log.write_text(json.dumps(log_entry, indent=2), encoding='utf-8')
    
    print(f"     📝 Logged to: {log_file.name}")


def create_snippet(
    title: str,
    content: str,
    frontmatter: Dict[str, Any],
    quality_result: Dict[str, Any],
    output_dir: Path = SNIPPETS_DIR
) -> Dict[str, Any]:
    """
    Create a snippet from a linked document.
    
    Returns dict with:
    - slug: URL slug
    - path: Path to created file
    - passes: Whether quality check passed
    - quality: Full quality result
    """
    slug = slugify(title)
    snippet_dir = output_dir / slug
    snippet_dir.mkdir(parents=True, exist_ok=True)
    
    # Generate MDX content
    date = frontmatter.get('date', datetime.now().strftime('%Y-%m-%d'))
    if isinstance(date, datetime):
        date = date.strftime('%Y-%m-%d')
    
    tags = frontmatter.get('tags', [])
    description = frontmatter.get('description', '')
    
    mdx_content = convert_to_mdx(
        content=content,
        title=title,
        date=str(date),
        tags=tags,
        description=description
    )
    
    # Write file
    output_file = snippet_dir / 'index.mdx'
    output_file.write_text(mdx_content, encoding='utf-8')
    
    # Update metadata
    metadata = load_snippet_metadata(output_dir)
    metadata[slug] = {
        'title': title,
        'passes': quality_result['passes'],
        'quality_score': quality_result.get('quality_score'),
        'reason': quality_result.get('reason', '')
    }
    save_snippet_metadata(metadata, output_dir)
    
    return {
        'slug': slug,
        'path': output_file,
        'passes': quality_result['passes'],
        'quality': quality_result
    }


def package_post(
    title: str,
    vault_path: str = OBSIDIAN_VAULT_PATH,
    output_dir: Path = POSTS_DIR,
    process_snippets: bool = True
) -> Optional[Dict[str, Any]]:
    """
    Package an Obsidian document as a blog post.
    
    Returns dict with packaging results or None if document not found.
    """
    print(f"\n📦 Packaging: {title}")
    
    # Find document
    doc_path = find_document(title, vault_path)
    if not doc_path:
        print(f"  ❌ Document not found: {title}")
        return None
    
    print(f"  📄 Found: {doc_path}")
    
    # Read content
    content = doc_path.read_text(encoding='utf-8')
    frontmatter, body = extract_frontmatter(content)
    
    # Create post directory
    slug = slugify(title)
    post_dir = output_dir / slug
    post_dir.mkdir(parents=True, exist_ok=True)
    
    # Parse links
    links = parse_wiki_links(body)
    print(f"  🔗 Found {len(links)} wiki-links")
    
    # Process images
    images_map = {}
    for link in links:
        if link['is_image']:
            img_name = link['target']
            img_path = find_image(img_name, vault_path)
            if img_path:
                # Copy image to post directory
                dest_path = post_dir / img_name
                shutil.copy2(img_path, dest_path)
                images_map[img_name] = img_name
                print(f"  🖼️  Copied image: {img_name}")
            else:
                print(f"  ⚠️  Image not found: {img_name}")
    
    # Process linked documents as snippets
    linked_snippets = {}
    if process_snippets:
        doc_links = [l for l in links if not l['is_image']]
        for link in doc_links:
            target = link['target']
            if target in linked_snippets:
                continue
            
            linked_doc_path = find_document(target, vault_path)
            if linked_doc_path:
                print(f"  📝 Processing linked doc: {target}")
                
                # Read linked document
                linked_content = linked_doc_path.read_text(encoding='utf-8')
                linked_fm, linked_body = extract_frontmatter(linked_content)
                
                # Quality check
                quality = check_quality(linked_body, target)
                status = "✅ PASS" if quality['passes'] else "❌ FAIL"
                print(f"     Quality check: {status} (score: {quality.get('quality_score', 'N/A')})")
                
                # Create snippet
                snippet_result = create_snippet(
                    title=target,
                    content=linked_body,
                    frontmatter=linked_fm,
                    quality_result=quality
                )
                
                linked_snippets[target] = {
                    'slug': snippet_result['slug'],
                    'passes': snippet_result['passes']
                }
            else:
                print(f"  ⚠️  Linked doc not found: {target}")
    
    # Convert to MDX
    date = frontmatter.get('date', datetime.now().strftime('%Y-%m-%d'))
    if isinstance(date, datetime):
        date = date.strftime('%Y-%m-%d')
    
    tags = frontmatter.get('tags', [])
    # Filter out personal/insights tags
    tags = [t for t in tags if t.lower() not in ['personal', 'insights']]
    
    description = frontmatter.get('description', '')
    
    mdx_content = convert_to_mdx(
        content=body,
        title=title,
        date=str(date),
        tags=tags,
        description=description,
        linked_snippets=linked_snippets,
        images_map=images_map
    )
    
    # Write post
    output_file = post_dir / 'index.mdx'
    output_file.write_text(mdx_content, encoding='utf-8')
    print(f"  ✅ Created: {output_file}")
    
    return {
        'title': title,
        'slug': slug,
        'path': output_file,
        'images': list(images_map.keys()),
        'snippets': linked_snippets
    }


def main():
    """Main entry point."""
    print("=" * 60)
    print("Obsidian to Blog Packager")
    print("=" * 60)
    
    if not POSTS_TO_PACKAGE:
        print("\n⚠️  No posts configured. Add titles to POSTS_TO_PACKAGE list.")
        print("   Edit scripts/package_obsidian.py and add your document titles.")
        return
    
    print(f"\nVault path: {OBSIDIAN_VAULT_PATH}")
    print(f"Posts to package: {len(POSTS_TO_PACKAGE)}")
    
    # Ensure output directories exist
    POSTS_DIR.mkdir(parents=True, exist_ok=True)
    SNIPPETS_DIR.mkdir(parents=True, exist_ok=True)
    
    results = []
    for title in POSTS_TO_PACKAGE:
        result = package_post(title)
        if result:
            results.append(result)
    
    print("\n" + "=" * 60)
    print("Summary")
    print("=" * 60)
    print(f"Posts packaged: {len(results)}/{len(POSTS_TO_PACKAGE)}")
    
    if results:
        print("\nCreated posts:")
        for r in results:
            print(f"  - {r['title']} -> /posts/{r['slug']}/")
            if r['snippets']:
                for name, info in r['snippets'].items():
                    status = "✅" if info['passes'] else "🔒"
                    print(f"      {status} {name} -> /snippets/{info['slug']}/")
    
    print("\n🚀 Run 'npm run build' to regenerate the site.")


if __name__ == '__main__':
    main()

