#!/bin/bash

# Script to easily add a new blog post from a markdown file
# Usage: ./add-post.sh "Post Title" path/to/file.md [YYYY-MM-DD]

if [ $# -lt 2 ]; then
    echo "Usage: ./add-post.sh \"Post Title\" path/to/file.md [YYYY-MM-DD]"
    echo ""
    echo "Example: ./add-post.sh \"My New Post\" ~/Downloads/article.md 2025-12-01"
    exit 1
fi

TITLE="$1"
MARKDOWN_FILE="$2"
DATE="${3:-$(date +%Y-%m-%d)}"

# Create slug from title
SLUG=$(echo "$TITLE" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-\|-$//g')
POST_DIR="content/posts/$SLUG"

# Create directory
mkdir -p "$POST_DIR"

# Extract content from markdown file (skip existing frontmatter if present)
if grep -q "^---$" "$MARKDOWN_FILE"; then
    # File has frontmatter, extract content after second ---
    CONTENT=$(awk '/^---$/{if(++count==2) next} count>=2' "$MARKDOWN_FILE")
else
    # No frontmatter, use entire file
    CONTENT=$(cat "$MARKDOWN_FILE")
fi

# Create the MDX file with frontmatter
cat > "$POST_DIR/index.mdx" << EOF
---
title: $TITLE
date: $DATE
description: 
tags:
  - 
---

$CONTENT
EOF

echo "✅ Created post: $POST_DIR/index.mdx"
echo ""
echo "Next steps:"
echo "1. Edit $POST_DIR/index.mdx to add description and tags"
echo "2. Run: npm run build (or it will auto-build on Netlify)"
echo ""
echo "Post will be available at: /$SLUG/"
