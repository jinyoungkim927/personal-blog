#!/usr/bin/env python3
"""
Snippet Review Generator

This script reviews snippets that scored low in quality checks and generates
detailed improvement suggestions in REVIEW_SNIPPET_{name}.md files in the
Obsidian vault.

Usage:
    python scripts/review_snippets.py

The script will:
1. Find all snippets that failed or scored below threshold
2. Generate detailed feedback using GPT-4o
3. Create REVIEW_SNIPPET_{name}.md files in Obsidian vault
"""

import os
import json
import re
from pathlib import Path
from datetime import datetime
from typing import Optional, Dict, Any, List
from dotenv import load_dotenv

# Load environment variables
load_dotenv(Path(__file__).parent / '.env')

# Configuration
OBSIDIAN_VAULT_PATH = os.getenv('OBSIDIAN_VAULT_PATH', '/Users/jinyoungkim/Documents/Obsidian Vault')
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY', '')
SNIPPETS_DIR = Path(__file__).parent.parent / 'content' / 'snippets'
LOGS_DIR = Path(__file__).parent / 'logs'

# Review threshold - generate reviews for snippets scoring at or below this
REVIEW_THRESHOLD = 7

# Model to use (most expensive/capable)
REVIEW_MODEL = "gpt-4o"  # or "gpt-4-turbo" for even more capability


def find_document(title: str, vault_path: str = OBSIDIAN_VAULT_PATH) -> Optional[Path]:
    """Find a document in the vault by title."""
    vault = Path(vault_path)
    target_filename = f"{title}.md".lower()
    
    for md_file in vault.rglob('*.md'):
        if md_file.name.lower() == target_filename:
            return md_file
    return None


def get_recent_quality_checks() -> Dict[str, Dict[str, Any]]:
    """
    Get the most recent quality check results for each snippet.
    Returns dict mapping snippet title to its quality result.
    """
    results = {}
    
    # Find all log files
    if not LOGS_DIR.exists():
        return results
    
    log_files = sorted(LOGS_DIR.glob('ai_checks_*.json'), reverse=True)
    
    for log_file in log_files:
        try:
            with open(log_file, 'r', encoding='utf-8') as f:
                logs = json.load(f)
                
            for entry in logs:
                title = entry.get('title', '')
                if title and title not in results:
                    results[title] = {
                        'result': entry.get('result', {}),
                        'content_preview': entry.get('content_preview', ''),
                        'timestamp': entry.get('timestamp', '')
                    }
        except Exception as e:
            print(f"  Warning: Could not read {log_file}: {e}")
    
    return results


def generate_review(title: str, content: str, quality_result: Dict[str, Any]) -> str:
    """
    Generate detailed review suggestions using GPT-4o.
    Returns markdown-formatted review content.
    """
    if not OPENAI_API_KEY:
        return f"# Review for {title}\n\n⚠️ No OpenAI API key configured. Cannot generate review."
    
    try:
        import openai
        client = openai.OpenAI(api_key=OPENAI_API_KEY)
        
        # Truncate content if too long
        max_chars = 12000
        review_content = content[:max_chars] if len(content) > max_chars else content
        
        score = quality_result.get('quality_score', 'N/A')
        reason = quality_result.get('reason', 'No reason provided')
        
        prompt = f"""You are a thoughtful editor helping improve personal knowledge notes for publication on a digital garden blog. The author has their own voice and style - your job is to help them improve while preserving their authentic perspective.

DOCUMENT TITLE: {title}

CURRENT QUALITY ASSESSMENT:
- Score: {score}/10
- Reason: {reason}

FULL DOCUMENT CONTENT:
{review_content}

Please provide a detailed review with specific, actionable suggestions. Structure your response as follows:

## Summary
Brief assessment of the document's current state and main areas for improvement.

## Technical Gaps
Identify any technical concepts that are:
- Mentioned but not explained
- Potentially incorrect or oversimplified
- Missing important caveats or context

For each gap, provide:
- What's missing
- A suggested addition or correction (keeping the author's voice)

## Structural Issues
Identify problems with:
- Logical flow and organization
- Jumps between ideas without transitions
- Missing introductions or conclusions
- Bullet points that need more context

## Writing Feedback
Specific suggestions for:
- Unclear sentences (quote them and suggest rewrites)
- Grammar or spelling issues
- Places where more explanation would help
- Opportunities to add personal insight or examples

## Quick Wins
3-5 specific, easy changes that would immediately improve the document:
1. [specific change]
2. [specific change]
...

## Suggested Additions
Any concepts, examples, or sections that would significantly enhance the document.

Remember: Preserve the author's voice and style. These are personal notes being shared, not academic papers. The goal is clarity and value, not perfection."""

        response = client.chat.completions.create(
            model=REVIEW_MODEL,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=4000
        )
        
        review_text = response.choices[0].message.content.strip()
        
        # Format as markdown file
        header = f"""---
title: Review - {title}
date: {datetime.now().strftime('%Y-%m-%d')}
type: review
original_score: {score}
---

# Review: {title}

> **Original Score:** {score}/10
> **Assessment:** {reason}
> **Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M')}

---

"""
        return header + review_text
        
    except Exception as e:
        return f"# Review for {title}\n\n⚠️ Error generating review: {e}"


def create_review_file(title: str, review_content: str, vault_path: str = OBSIDIAN_VAULT_PATH) -> Path:
    """
    Create a REVIEW_SNIPPET_{title}.md file in the Obsidian vault.
    Returns the path to the created file.
    """
    vault = Path(vault_path)
    
    # Sanitize title for filename
    safe_title = re.sub(r'[^\w\s-]', '', title).strip()
    safe_title = re.sub(r'[-\s]+', '_', safe_title)
    
    filename = f"REVIEW_SNIPPET_{safe_title}.md"
    filepath = vault / filename
    
    filepath.write_text(review_content, encoding='utf-8')
    return filepath


def get_snippet_content(title: str, vault_path: str = OBSIDIAN_VAULT_PATH) -> Optional[str]:
    """Get the full content of a snippet from the Obsidian vault."""
    doc_path = find_document(title, vault_path)
    if doc_path and doc_path.exists():
        return doc_path.read_text(encoding='utf-8')
    return None


def main():
    """Main entry point."""
    print("=" * 60)
    print("Snippet Review Generator")
    print("=" * 60)
    print(f"\nUsing model: {REVIEW_MODEL}")
    print(f"Review threshold: score <= {REVIEW_THRESHOLD}")
    print(f"Obsidian vault: {OBSIDIAN_VAULT_PATH}")
    
    # Get recent quality checks
    quality_checks = get_recent_quality_checks()
    
    if not quality_checks:
        print("\n⚠️  No quality check logs found. Run package_obsidian.py first.")
        return
    
    print(f"\nFound {len(quality_checks)} snippets with quality checks.")
    
    # Find snippets that need review
    needs_review = []
    for title, data in quality_checks.items():
        result = data.get('result', {})
        score = result.get('quality_score', 10)
        passes = result.get('passes', True)
        
        # Review if: failed OR scored at or below threshold
        if not passes or score <= REVIEW_THRESHOLD:
            needs_review.append({
                'title': title,
                'score': score,
                'passes': passes,
                'result': result
            })
    
    if not needs_review:
        print("\n✅ All snippets scored above threshold. No reviews needed.")
        return
    
    # Sort by score (lowest first)
    needs_review.sort(key=lambda x: x['score'])
    
    print(f"\n📝 {len(needs_review)} snippets need review:")
    for item in needs_review:
        status = "❌ FAIL" if not item['passes'] else f"⚠️  Score {item['score']}"
        print(f"   - {item['title']}: {status}")
    
    print("\n" + "-" * 60)
    print("Generating reviews...")
    print("-" * 60)
    
    created_files = []
    
    for item in needs_review:
        title = item['title']
        print(f"\n📄 Reviewing: {title}")
        
        # Get full content from Obsidian
        content = get_snippet_content(title)
        if not content:
            print(f"   ⚠️  Could not find document in vault, skipping")
            continue
        
        # Generate review
        print(f"   🤖 Generating review with {REVIEW_MODEL}...")
        review_content = generate_review(title, content, item['result'])
        
        # Create review file
        filepath = create_review_file(title, review_content)
        created_files.append(filepath)
        print(f"   ✅ Created: {filepath.name}")
    
    print("\n" + "=" * 60)
    print("Summary")
    print("=" * 60)
    print(f"Reviews generated: {len(created_files)}")
    
    if created_files:
        print("\nCreated files:")
        for f in created_files:
            print(f"  📝 {f.name}")
        
        print(f"\n📂 Files are in: {OBSIDIAN_VAULT_PATH}")
        print("   Open Obsidian to view and apply suggestions.")


if __name__ == '__main__':
    main()
