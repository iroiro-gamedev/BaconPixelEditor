# Bacon Pixel Editor

A browser-based pixel art editor built with vanilla JavaScript. No installation required — just open `index.html` in a modern web browser.

---

## Overview

Bacon Pixel Editor (BPE) is a lightweight, feature-rich pixel art tool that runs entirely in the browser. It supports multi-layer animation, a full palette workflow, and exports to PNG, GIF, and sprite sheets. Work is auto-saved to `localStorage` so your project persists across page reloads.

---

## Features

### Canvas & Drawing
- **Tools:** Pencil, Eraser, Fill (Flood / All-color), Line, Rectangle, Ellipse, Eyedropper, Select
- **Mirror drawing:** Horizontal and vertical mirror modes
- **Filled shapes:** Toggle filled/outline for rectangle and ellipse tools
- **Canvas resize:** Resize with 9-point anchor selection

### Selection & Transform
- Rectangular selection with Shift+drag (add) and Ctrl+drag (subtract)
- Move, rotate (handle drag), and commit floating selections
- **Rotate:** 90° CW / CCW / 180°
- **Flip:** Horizontal and vertical

### Layers & Frames
- Multi-layer, multi-frame animation support
- Add, duplicate, delete, reorder (drag) layers and frames
- Per-layer visibility toggle
- Layer/frame thumbnails in the table view

### Palette
- Editable palette with swatch click to set foreground / background color
- Import palette from any image
- Per-color opacity (alpha) slider
- Add Outline (4-directional or 8-directional diagonal fill)
- Add Anti-alias (auto semi-transparent corner pixels)

### Animation
- Adjustable FPS (1–60)
- Looping preview playback with zoom control

### File Formats
| Action | Format |
|--------|--------|
| Save / Open | `.bpe` (JSON, includes layers, palette, memo, FPS) |
| Export | PNG, GIF (animated), Sprite Sheet PNG |

### Multi-Tab Workflow
- Open multiple projects simultaneously in tabs
- Drag to reorder tabs; each tab maintains its own undo/redo stack
- Cross-tab copy/paste with automatic palette remapping

### UI & Accessibility
- **Themes:** Dark mode (default) and Light mode — preference saved in `localStorage`
- **Languages:** English, Japanese (日本語), Simplified Chinese (简体中文)
- Memo panel (per-tab free-text note, saved with project)
- Resizable panels (right panel width, layer/frame panel height, memo height)
- Auto-save to `localStorage` (2-second debounce after any edit)

---

## Usage

### Getting Started

1. Open `index.html` in a modern browser (Chrome, Edge, Firefox).
2. A blank 16×16 canvas is created automatically.
3. Select a tool from the left toolbar and draw on the canvas.

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `P` | Pencil |
| `E` | Eraser |
| `F` | Fill |
| `I` | Eyedropper |
| `L` | Line |
| `R` | Rectangle |
| `O` | Ellipse |
| `S` | Select |
| `G` | Toggle grid |
| `+` / `-` | Zoom in / out |
| `0` | Fit to screen |
| `Ctrl+Z` | Undo |
| `Ctrl+Y` | Redo |
| `Ctrl+A` | Select all |
| `Ctrl+C` | Copy |
| `Ctrl+V` | Paste |
| `Del` | Delete selection |
| `Esc` | Deselect |

### Saving & Exporting

- **File > Save (.bpe)** — saves the full project (layers, frames, palette, memo) as a `.bpe` file.
- **File > Export as PNG** — exports the current frame as a PNG at the chosen scale.
- **File > Export as GIF** — exports an animated GIF.
- **File > Export as Sprite Sheet** — exports all frames horizontally as a single PNG.
- **File > Export as BPE** — same as Save but always prompts for filename.

### Theme & Language

Click the **Dark/Light** button (top-right) to toggle themes. Click **EN / JA / 中文** to cycle languages. Both settings are remembered across sessions.

---

## License

MIT License

Copyright (c) 2026 iroiro

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

---

## Author

**iroiro**
- [OFUSE](https://ofuse.me/o?uid=156126)
