# Markdown Frontmatter

A VSCode extension that automatically updates frontmatter fields in Markdown/MDX files on save.

## Features

- Auto-update `updatedTime` on save
- Auto-add `createdTime` when missing
- Auto-generate `slug` from filename
- Support custom fields with default values
- Highly configurable
- Manual trigger via command palette

## Installation

### From VSIX

```bash
# Build
yarn install
yarn compile
vsce package

# Install
code --install-extension markdown-frontmatter-x.x.x.vsix
```

### Development

1. Open project in VSCode
2. Press `F5` to launch Extension Development Host
3. Test with any `.md` or `.mdx` file

## Configuration

Add to your `settings.json`:

```json
{
  "markdownFrontmatter.enable": true,
  "markdownFrontmatter.updateOnSave": true,
  "markdownFrontmatter.fileTypes": ["md", "mdx"],
  "markdownFrontmatter.timeFormat": "YYYY-MM-DD HH:mm:ss",
  "markdownFrontmatter.fields": {
    "updatedTime": {
      "type": "timestamp"
    },
    "createdTime": {
      "type": "timestamp",
      "onlyIfMissing": true
    },
    "slug": {
      "type": "filename"
    },
    "title": {
      "type": "default",
      "onlyIfMissing": true
    },
    "category": {
      "type": "default",
      "value": ["category"],
      "onlyIfMissing": true
    }
  }
}
```

## Field Types

| Type | Description | Example |
|------|-------------|---------|
| `timestamp` | Current datetime | `'2025-12-31 15:00:00'` |
| `filename` | Filename without extension | `my-post` |
| `default` | Custom default value | Uses key name if `value` not specified |

## Field Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `type` | string | - | Field type: `timestamp`, `filename`, `default` |
| `onlyIfMissing` | boolean | `false` | Only add if field doesn't exist |
| `value` | any | key name | Default value (for `default` type) |

## Commands

- `Markdown Frontmatter: Update` - Manually update frontmatter

## Example

Before:
```markdown
# My Post

Content here...
```

After save:
```yaml
---
updatedTime: '2025-12-31 15:00:00'
createdTime: '2025-12-31 15:00:00'
slug: my-post
title: title
category:
  - category
---

# My Post

Content here...
```

## License

MIT
