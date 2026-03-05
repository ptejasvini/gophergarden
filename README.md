# Gopher Garden - Go Solutions Static Website

A fully static website for displaying Go (Golang) coding problem solutions. Built with HTML, CSS, and Vanilla JavaScript, deployable to GitHub Pages.

## Features

- **Static Site**: No backend required, works entirely on GitHub Pages
- **Dark Mode**: Toggle between light and dark themes with preference persistence
- **Search & Filter**: Real-time search and difficulty-based filtering
- **Responsive Design**: Mobile-friendly layout
- **Syntax Highlighting**: Go code highlighting with Prism.js
- **Markdown Rendering**: Problem descriptions rendered from Markdown

## Folder Structure

```
/
│
├── solutions/          # Go solution files (.go)
├── content/            # Problem descriptions (.md with frontmatter)
├── index.html          # Homepage with problem cards
├── problem.html        # Individual problem page
├── styles.css          # CSS styles with dark mode support
├── script.js           # Vanilla JavaScript logic
├── README.md           # This file
└── .github/
    └── workflows/
        └── deploy.yml  # GitHub Actions deployment workflow
```

## How to Add New Problems

1. **Create Solution File**: Add your Go solution to `solutions/{problem-name}.go`
   - Use kebab-case for the filename (e.g., `two-sum.go`)
   - Include a complete, working Go program with main function

2. **Create Content File**: Add problem description to `content/{problem-name}.md`
   - Use the same name as the solution file
   - Follow the required Markdown format (see below)

3. **Update Problem List**: In `script.js`, add the new problem name to the `problemNames` array in `loadProblems()`

## Markdown Format Rules

Each problem's markdown file must follow this exact format:

```markdown
---
title: Problem Title
difficulty: Easy|Medium|Hard
tags: [Tag1, Tag2, Tag3]
---

## Problem Description

Your problem description here...

## Examples

**Example 1:**

Input: ...
Output: ...

## Constraints

- Constraint 1
- Constraint 2
```

### Frontmatter Fields

- `title`: The display title of the problem
- `difficulty`: Must be "Easy", "Medium", or "Hard" (case-sensitive)
- `tags`: Array of relevant tags (e.g., Array, HashMap, String)

### Content Section

Everything after the second `---` is the problem description, which will be rendered as Markdown.

## How to Deploy to GitHub Pages

1. **Repository Setup**:
   - Create a GitHub repository named `gophergarden`
   - The static site files are already in the root of the repository

2. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Set source to "GitHub Actions"

3. **Automatic Deployment**:
   - The workflow in `.github/workflows/deploy.yml` will automatically deploy on pushes to `main`
   - Your site will be available at `https://yourusername.github.io/gophergarden`

4. **Manual Deployment** (if needed):
   - Push changes to the `main` branch
   - The GitHub Action will run automatically

## Development

To test locally:

1. Open `index.html` in a web browser
2. All functionality works offline (except for the external CDN scripts for Markdown and syntax highlighting)

## Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Custom properties for theming, responsive design
- **Vanilla JavaScript**: ES6+ features, fetch API, localStorage
- **Marked.js**: Markdown rendering
- **Prism.js**: Syntax highlighting
- **GitHub Actions**: Automated deployment

## Screenshots

<!-- Add screenshots here after deployment -->

## Contributing

1. Fork the repository
2. Add new problems following the format above
3. Test locally
4. Submit a pull request

## License

This project is open source. Feel free to use and modify as needed.