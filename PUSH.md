# Pushing this repo to GitHub

The project is already a git repository with one commit and a correct `.gitignore`
(`node_modules`, `.next`, build output and env files are excluded).

## 1. The repo

<https://github.com/suyashpandey8088-cell/Portfolio-Website> — already created,
public, empty, default branch `main`. The `origin` remote is already configured
in this repository, so there is nothing to set up.

## 2. Get this code onto your machine

Download `suyash-portfolio.tar.gz` from the workspace, then:

```bash
tar -xzf suyash-portfolio.tar.gz
cd portfolio
```

The extracted folder already contains the `.git` history — no need to re-init.

## 3. Push

```bash
git push -u origin main
```

If git asks for a password: GitHub no longer accepts account passwords over HTTPS.
Paste a Personal Access Token (<https://github.com/settings/tokens>) as the password,
or switch the remote to SSH if you have a key on this machine:

```bash
git remote set-url origin git@github.com:suyashpandey8088-cell/Portfolio-Website.git
git push -u origin main
```

### Commit authorship

Commits are authored as
`Suyash Pandey <241322812+suyashpandey8088-cell@users.noreply.github.com>` — GitHub's
noreply address for your account, so they are attributed to you without publishing a
personal email. To use a different address instead:

```bash
git config user.email "you@your-domain.com"
FILTER_BRANCH_SQUELCH_WARNING=1 git filter-branch -f --env-filter '
  export GIT_AUTHOR_EMAIL="you@your-domain.com"
  export GIT_COMMITTER_EMAIL="you@your-domain.com"' -- --all
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
