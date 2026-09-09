#!/usr/bin/env bash
set -e

echo "==> Downloading official Android platform-tools from Google..."
curl -sSL "https://dl.google.com/android/repository/platform-tools-latest-linux.zip" -o "/tmp/platform-tools.zip"

echo "==> Extracting to $HOME/.android-sdk/..."
mkdir -p "$HOME/.android-sdk"
unzip -qo "/tmp/platform-tools.zip" -d "$HOME/.android-sdk"

echo "==> Creating symlinks in $HOME/.local/bin/..."
mkdir -p "$HOME/.local/bin"
ln -sf "$HOME/.android-sdk/platform-tools/adb" "$HOME/.local/bin/adb"
ln -sf "$HOME/.android-sdk/platform-tools/fastboot" "$HOME/.local/bin/fastboot"

# Ensure PATH is in ~/.bashrc if not already present
if ! grep -q ".android-sdk/platform-tools" "$HOME/.bashrc" 2>/dev/null; then
  echo 'export PATH="$HOME/.android-sdk/platform-tools:$PATH"' >> "$HOME/.bashrc"
fi

rm -f "/tmp/platform-tools.zip"

echo "==> Verifying adb installation:"
"$HOME/.android-sdk/platform-tools/adb" --version
echo "==> ADB installation complete!"
