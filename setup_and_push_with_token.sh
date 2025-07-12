#!/usr/bin/env bash

set -euo pipefail

# === ✅ Config ===
GITHUB_USERNAME="JKTK25"
REPO_NAME="studio"
BRANCH_NAME="master"
GITHUB_TOKEN="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"  # Replace this or export it externally
LFS_PATTERNS=("*.zip" "*.psd" "*.node")

# Add Nix profile to path (if using Nix-installed git-lfs etc.)
export PATH="$HOME/.nix-profile/bin:$PATH"

# === 🔗 Remote Setup ===
REMOTE_URL="https://${GITHUB_USERNAME}:${GITHUB_TOKEN}@github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"
echo "🔗 Ensuring remote 'origin' points to $REMOTE_URL"
if git remote | grep -q '^origin$'; then
  git remote set-url origin "$REMOTE_URL"
else
  git remote add origin "$REMOTE_URL"
fi

# === 🔧 Git LFS Setup ===
echo "🔧 Initializing Git LFS..."
if ! command -v git-lfs &>/dev/null; then
  echo "❌ git-lfs not found. Install with: nix-env -iA nixpkgs.git-lfs"
  exit 1
fi
git lfs install

echo "🎯 Tracking large file types with Git LFS..."
for pattern in "${LFS_PATTERNS[@]}"; do
  git lfs track "$pattern"
done
git add .gitattributes

# === 📝 Ignore Unwanted Folders ===
echo "📝 Adding build/dependency folders to .gitignore..."
cat <<EOF >> .gitignore
.next/
node_modules/
.firebase/
EOF
git add .gitignore

# === 🧹 Clean Git History ===
echo "🧹 Cleaning history using git-filter-repo..."
if ! command -v git-filter-repo &>/dev/null; then
  echo "❌ git-filter-repo not installed. Install with: nix-env -iA nixpkgs.git-filter-repo"
  exit 1
fi

git filter-repo --force \
  --path .firebase --path .next --path node_modules --invert-paths

# === 🚀 Commit and Push ===
git add .
git commit -m "Setup with LFS, cleanup, .gitignore, and push to private GitHub repo"
git push origin "$BRANCH_NAME" --force

echo "✅ Done: Pushed to $REPO_NAME on $BRANCH_NAME with LFS and cleaned history."