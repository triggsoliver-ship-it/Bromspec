#!/usr/bin/env bash
# ============================================================================
# Push the Bromspec site to GitHub — code, optimised photos, everything.
# Run once from a terminal:   bash push-to-github.sh
# You'll be asked to sign in to GitHub the first time.
# ============================================================================
set -e
cd "$(dirname "$0")"

REPO="https://github.com/triggsoliver-ship-it/Bromspec.git"

# Clear any stale lock left by another tool
rm -f .git/index.lock 2>/dev/null || true

# Make sure this is a git repo pointed at the right remote
if [ ! -d .git ]; then git init; fi
git branch -M main 2>/dev/null || true
if git remote get-url origin >/dev/null 2>&1; then
  git remote set-url origin "$REPO"
else
  git remote add origin "$REPO"
fi

# Keep the heavy raw originals and junk out of the repo (optimised copies are in images/)
git rm -r --cached --ignore-unmatch "Bromspec Pics " bromspec-preview.html .DS_Store >/dev/null 2>&1 || true

git add -A
git commit -m "Bromspec site: photos, Blue Light 10% labour discount, Web3Forms enquiry form" \
  || echo "Nothing new to commit."

# --force replaces a throwaway initial commit that was on the empty repo.
# Safe here: your local copy is the complete, correct site.
git push -u --force origin main

echo ""
echo "Done -> https://github.com/triggsoliver-ship-it/Bromspec"
