#!/usr/bin/env python3
"""Simple contrast checker for CSS tokens in assets/css/styles.css
Parses hex color tokens --color-* and computes contrast ratios between
text/background combinations for light and dark tokens.

Usage: python3 tools/contrast_check.py
"""
import re
from pathlib import Path

CSS = Path('assets/css/styles.css').read_text()

# find tokens defined in :root or data-theme dark block
pattern = re.compile(r'--([a-z0-9-]+):\s*(#[0-9a-fA-F]{6})')
found = dict(pattern.findall(CSS))

if not found:
    print('No hex tokens found.')
    raise SystemExit(1)

# helper: hex to rgb

def hex_to_rgb(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i+2],16)/255.0 for i in (0,2,4))

# relative luminance

def lum(r,g,b):
    def f(c):
        if c <= 0.03928:
            return c/12.92
        return ((c+0.055)/1.055) ** 2.4
    return 0.2126*f(r) + 0.7152*f(g) + 0.0722*f(b)

# contrast ratio

def contrast(c1, c2):
    L1 = lum(*c1)
    L2 = lum(*c2)
    Lmax = max(L1,L2)
    Lmin = min(L1,L2)
    return (Lmax + 0.05) / (Lmin + 0.05)

# tokens of interest
pairs = [
    ('color-text','color-bg'),
    ('color-muted','color-bg'),
    ('color-primary','color-bg'),
    ('color-text','color-surface'),
    ('color-muted','color-surface'),
]

print('Found tokens:')
for k,v in found.items():
    print(f'  --{k}: {v}')

print('\nContrast results (ratio; WCAG pass >=4.5 for normal text, >=3 for large):')
for a,b in pairs:
    ka = found.get(a)
    kb = found.get(b)
    if not ka or not kb:
        print(f'  skipping --{a} vs --{b} (missing token)')
        continue
    ca = hex_to_rgb(ka)
    cb = hex_to_rgb(kb)
    r = contrast(ca,cb)
    status = 'PASS' if r >= 4.5 else ('LARGE' if r>=3 else 'FAIL')
    print(f'  --{a} ({ka}) on --{b} ({kb}): {r:.2f} -> {status}')

# Also check dark tokens (they appear later in file). We'll attempt to extract dark block tokens by scanning data-theme dark block

dark_block = re.search(r'\[data-theme="dark"\][^{]*\{([^}]*)\}', CSS, re.S)
if dark_block:
    dark_text = dict(pattern.findall(dark_block.group(1)))
    if dark_text:
        print('\nDark-mode token contrasts:')
        for a,b in pairs:
            ka = dark_text.get(a) or found.get(a)
            kb = dark_text.get(b) or found.get(b)
            if not ka or not kb:
                print(f'  skipping --{a} vs --{b} (missing token)')
                continue
            ca = hex_to_rgb(ka)
            cb = hex_to_rgb(kb)
            r = contrast(ca,cb)
            status = 'PASS' if r >= 4.5 else ('LARGE' if r>=3 else 'FAIL')
            print(f'  --{a} ({ka}) on --{b} ({kb}): {r:.2f} -> {status}')
else:
    print('\nNo data-theme="dark" block found to analyze dark tokens.')
