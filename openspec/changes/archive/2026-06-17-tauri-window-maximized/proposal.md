## Why

Currently, when the desktop application launches, the window opens in a small default resolution of 800x600. For a side-by-side editing and PDF preview layout, this workspace is too small, requiring users to manually maximize or expand the window every time. Starting the app in a maximized state and increasing the default size improves usability.

## What Changes

- **Maximized Start**: Configure Tauri to launch the primary window in a maximized state.
- **Improved Default Dimensions**: Adjust the fallback window dimensions to a roomier 1280x800 for cases where the window is unmaximized.

## Capabilities

### New Capabilities
- `tauri-window-maximized`: Configure the desktop application's main window startup behavior to launch maximized with a larger default resolution.

### Modified Capabilities
<!-- None -->

## Impact

- **Desktop Config (`src-tauri/tauri.conf.json`)**: Configures the primary window's `maximized`, `width`, and `height` properties in the Tauri config file.
