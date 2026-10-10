#!/bin/bash
# WordForge macOS Gatekeeper Resolver & Launcher
# Removes the browser quarantine flag and launches WordForge

echo "=========================================="
echo " WordForge macOS Gatekeeper Resolver"
echo "=========================================="

APP_PATH="/Applications/WordForge.app"
DMG_APP="/Volumes/WordForge"*"/WordForge.app"

if [ -d "$APP_PATH" ]; then
    echo "Clearing quarantine from $APP_PATH..."
    xattr -cr "$APP_PATH" 2>/dev/null
    echo "Launching WordForge..."
    open "$APP_PATH"
    echo "WordForge launched successfully!"
    exit 0
fi

# If in mounted DMG or Downloads
for path in /Volumes/WordForge*/WordForge.app ~/Downloads/WordForge*/WordForge.app; do
    if [ -d "$path" ]; then
        echo "Found WordForge at: $path"
        echo "Installing to /Applications/WordForge.app..."
        cp -R "$path" /Applications/WordForge.app
        xattr -cr /Applications/WordForge.app 2>/dev/null
        echo "Launching WordForge..."
        open /Applications/WordForge.app
        echo "WordForge installed and launched successfully!"
        exit 0
    fi
done

echo "Please copy WordForge.app to your Applications folder first, then run:"
echo "  xattr -cr /Applications/WordForge.app"
