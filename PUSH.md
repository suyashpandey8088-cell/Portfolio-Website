# Pushing this repo to GitHub

The project is already a git repository with one commit and a correct `.gitignore`
(`node_modules`, `.next`, build output and env files are excluded).

## 1. Create the empty repo on GitHub

Go to <https://github.com/new> and create:

- **Name:** `suyash-portfolio`
- **Visibility:** Public
- **Do NOT** tick "Add a README", ".gitignore" or "license" — the repo must be
  empty, otherwise the first push is rejected as a non-fast-forward.

## 2. Get this code onto your machine

Download `suyash-portfolio.tar.gz` from the workspace, then:

```bash
tar -xzf suyash-portfolio.tar.gz
cd portfolio
```

The extracted folder already contains the `.git` history — no need to re-init.

## 3. Point it at your repo and push

Replace `YOUR-USERNAME`:

```bash
git remote add origin https://github.com/YOUR-USERNAME/suyash-portfolio.git
git push -u origin main
```

If git asks for a password, GitHub no longer accepts account passwords over HTTPS —
paste a Personal Access Token (<https://github.com/settings/tokens>) instead, or use
SSH:

```bash
git remote add origin git@github.com:YOUR-USERNAME/suyash-portfolio.git
git push -u origin main
```

## 4. Verify it runs from a clean clone

```bash
npm install
npm run dev     # http://localhost:3000
```

## Deploying (optional)

The site is a static-prerendered Next.js app, so Vercel needs no configuration:
import the GitHub repo at <https://vercel.com/new> and accept the defaults. Build
command `next build`, output handled automatically.
