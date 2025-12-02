# How to Add Markdown Posts

Your blog **already supports markdown files!** Here's how to add new posts:

## Quick Method: Use the Helper Script

```bash
./add-post.sh "My Post Title" path/to/your-file.md [YYYY-MM-DD]
```

**Example:**
```bash
./add-post.sh "Thoughts on AI" ~/Downloads/my-article.md 2025-12-01
```

This will:
- Create a folder in `content/posts/`
- Convert your markdown to MDX format
- Add the required frontmatter
- Set it up for your blog

## Manual Method

1. **Create a folder** in `content/posts/` with a URL-friendly name:
   ```bash
   mkdir content/posts/my-new-post
   ```

2. **Create `index.mdx`** in that folder:
   ```markdown
   ---
   title: My New Post
   date: 2025-12-01
   description: A brief description of the post
   tags:
     - Tag1
     - Tag2
   ---

   Your markdown content goes here!

   You can use **bold**, *italic*, and all standard markdown.

   ## Headings work too

   - Lists
   - Work
   - Fine
   ```

3. **That's it!** The blog will automatically:
   - Process the markdown
   - Style it beautifully
   - Add it to your blog list
   - Create a page for it

## What File Format?

- **`.mdx` files** - Recommended (markdown + React components)
- **`.md` files** - Also work! Just rename to `.mdx` or use the script

## Required Frontmatter

Every post needs this at the top (between `---` lines):

```yaml
---
title: Your Post Title
date: YYYY-MM-DD
description: Optional description
tags:
  - Tag1
  - Tag2
---
```

## Markdown Features Supported

Your blog supports all standard markdown plus:

- **Code blocks** with syntax highlighting
- **Images** - just put images in the same folder
- **Links** - `[text](url)`
- **Bold**, *italic*, ~~strikethrough~~
- **Lists** (ordered and unordered)
- **Blockquotes**
- **Tables**
- **And more!**

## Adding Images

1. Put image files in the same folder as your `index.mdx`
2. Reference them like: `![alt text](./image.jpg)`

## After Adding a Post

1. **Local testing**: `npm run develop` (see it at localhost:8000)
2. **Deploy**: Just commit and push to GitHub - Netlify auto-deploys!

```bash
git add content/posts/your-new-post/
git commit -m "Add new post: Your Title"
git push
```

That's it! Your post will be live in a few minutes.
