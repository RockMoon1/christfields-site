# Logo Processing

Original backup: logo-original-backup.png
Current logo: logo.png (transparent background + gold text)

## To regenerate logo.png from the original:
node C:\Users\lpell\AppData\Local\Temp\bg-remover\remove-bg.js

## What the script does:
1. Flood-fill background removal from all edges (white -> transparent)
2. Recolors the "ChristFields" text area (bottom 74.5%+) to gold hue (43deg)

## Adjustable values in remove-bg.js:
- BG_THRESHOLD (210) — how aggressively white pixels are removed
- textY (height * 0.745) — where the text region starts
- GOLD_SAT (0.72) — gold saturation of recolored text
- newL multiplier (1.25) — brightness boost on text pixels
