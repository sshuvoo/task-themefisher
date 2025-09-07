# Github API Manipulation with Next.js

A small Next.js app that lists a user's GitHub repositories (showing markdown files) and lets you compose posts locally and publish them to a configured GitHub repository as Markdown files.

## Files & Folder Structures

```
.
├── app
│   ├── error.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── [repo]
│       └── [path]
│           ├── error.tsx
│           ├── loading.tsx
│           └── page.tsx
├── components
│   ├── draft-card.tsx
│   ├── post-form.tsx
│   ├── repo-list.tsx
│   └── spinner
│       ├── index.tsx
│       └── spinner.module.css
├── hooks
│   └── use-persist.ts
├── README.md
├── server-actions
│   ├── get-all-repo.ts
│   ├── get-markdown.ts
│   └── publish-post.ts
└── utils
    └── index.ts
```

## Packages used

- `octokit` — Official GitHub REST API client for listing repos, reading file contents, and creating/updating content.
- `react-hot-toast` — Lightweight toast notifications for UI feedback.
- `react-markdown` — Renders Markdown to React elements for preview and display.
- `rehype-raw` — Enables raw HTML inside Markdown (used together with `rehype-sanitize`).
- `rehype-sanitize` — Sanitizes HTML to reduce XSS risk when `rehype-raw` is enabled.
- `remark-gfm` — Adds GitHub Flavored Markdown support (tables, task lists, strike-through).

## Environment variables

Create a `.env` in the project root for local development. Example:

```bash
# .env (example)
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GITHUB_USERNAME=your-github-username
GITHUB_REPO=target-repo-to-publish-posts
COMMITTER_NAME="Your Name"
COMMITTER_EMAIL=your.email@example.com
```

What each variable is and how to obtain it:

- `GITHUB_TOKEN` — Personal Access Token (PAT). Create it in GitHub Settings → Developer settings → Personal access tokens -> Fine-grained tokens -> Generate new token.
- Select **Only select repositories** and grant content read/write access to the target repository.
- `GITHUB_USERNAME` — Your GitHub username (string).
- `GITHUB_REPO` — The repository name where posts will be committed (string).
- `COMMITTER_NAME` — Name used for commit metadata.
- `COMMITTER_EMAIL` — Email used for commit metadata.

All environment variables are used server-side.

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Add `.env` with the variables above.

3. Start dev server:

```bash
npm run dev
```

4. Open `http://localhost:3000` in your browser.

## Recommended usage guidelines

- The title's first three words are used to generate the filename (spaces replaced with hyphens). Avoid duplicate titles to prevent overwriting files. for example, "My First Post" becomes `MY_FIRST_POST.md`.
- Try to avoid using special characters to avoid issues with filenames.
