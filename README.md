# Grid 4x4 — Custom layout for Amethyst

This repository contains a custom layout for Amethyst (macOS) called "Grid 4x4". It is designed to organize windows into
two sections (primary and secondary) with up to 4 windows per section, allowing for adjustment of the ratio between the
two areas and how many windows should be in the primary section.

Main file path: `Layouts/grid4x4.js`

## Features

- Two sections: main and secondary
- Up to 4 windows in the main section and up to 4 in the secondary (max 8 windows managed by the layout)
- Ratio between adjustable sections (from 10% to 90% of screen size)
- Support for landscape and portrait orientation with dedicated division logic
- Internal section subdivision optimized for 1–4 windows (1, 2, 3, 4)

## How it works

The layout automatically decides whether to arrange the areas vertically or horizontally based on the screen size:

- Landscape (wider than tall screen):
    - The main section occupies a vertical band on the left (width = `mainPaneRatio`).
    - The secondary section occupies the remaining space on the right.
- Portrait (taller than wide screen):
    - The main section occupies a horizontal band at the top (height = `mainPaneRatio`).
    - The secondary section occupies the remaining space at the bottom.

Within each section, the windows are arranged as follows:

- 1 window: to the entire area.
- 2 windows: side by side at 50%.
- 3 windows: one half for the first, the other half divided into two quadrants.
- 4 windows: 2x2 grid.

## Layout status and commands

The layout state uses two properties:

- `mainPaneRatio` (default 0.5): ratio of the main section to the screen, between 0.1 and 0.9.
- `mainPaneCount` (default 1): number of windows assigned to the main section, from 1 to 4 (the remainder goes to the
  secondary).

Available commands (defined in `grid4x4.js`):

- `shrinkMain` — Reduces `mainPaneRatio` by 0.1 (minimum 0.1). Effect: the main section shrinks.
- `expandMain` — Increase `mainPaneRatio` by 0.1 (maximum 0.9). Effect: the main section expands.
- `increaseMain` — Decreases `mainPaneCount` by 1 (minimum 1). Effect: FEWER windows in the main section, MORE in the
  secondary.
- `decreaseMain` — Increment `mainPaneCount` by 1 (maximum 4). Effect: MORE windows in the main section, LESS in the
  secondary.

Note: the names `increaseMain`/`decreaseMain` refer to the number of windows in the main section (not the size).
Therefore, "increaseMain" reduces the count (moves windows out of the main section), while "decreaseMain" increases it.

## Installation

1. Ensure you have Amethyst installed on macOS.
2. Copy `grid4x4.js` to Amethyst's custom layouts folder:
   `~/Library/Application Support/Amethyst/Layouts/`
3. Restart Amethyst, or toggle layouts in Preferences.
4. Go to Amethyst → Preferences → Layouts and enable the "Grid 4x4" layout (Custom section).

## Shortcuts and commands

- Select the layout: you can add "Grid 4x4" to the list of active layouts and then cycle through layouts with the
  standard Amethyst shortcuts (Cycle Layout Forward/Backward), or assign a shortcut to the "Select layout" option when
  available.
- Layout commands: in Preferences → Shortcuts, assign keys to the commands exposed by the layout (shrinkMain,
  expandMain, increaseMain, decreaseMain) when Amethyst makes them available for custom layouts.

Common mapping suggestions:

- Shrink/Expand main area: shrinkMain / expandMain
- Move windows between sections: increaseMain (less in main) / decreaseMain (more in main)

## Visual examples (landscape)

- `mainPaneCount = 1` (ratio 0.5)

```
|   MAIN   | SECONDARY |
|   (1)    |  (rest)  |
```

- `mainPaneCount = 3`

```
|   MAIN (3 windows: 1/2 + 1/4 + 1/4)  | SECONDARY |
```

- `mainPaneCount = 4`

```
|   MAIN (grid 2x2) | SECONDARY |
```

## Limits

- Maximum number of windows considered: 8 (4 main + 4 secondary). Additional windows beyond this threshold are not
  handled by the layout.
- `mainPaneCount` is limited to 1–4.
- `mainPaneRatio` is limited to 0.1–0.9.

## Troubleshooting

- The layout does not appear? Check that you have saved `grid4x4.js` in the correct path and restart Amethyst.
- The commands are not working? Verify that you have assigned the shortcuts in Preferences → Shortcuts and that the
  active layout is "Grid 4x4".
- Screen rotated? The layout automatically adapts the orientation (portrait vs landscape), but the internal division
  remains consistent with the rules above.

## Main files

- `grid4x4.js`implementation of the layout and its commands.
- Other files in the folder can be example layouts or tests, not necessary to use Grid 4x4.

## License

This project is licensed under the MIT License.

Copyright (c) 2025 Luca

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.