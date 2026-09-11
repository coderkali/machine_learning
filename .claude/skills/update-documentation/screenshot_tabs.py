#!/usr/bin/env python3
"""Screenshot every tab of the learning site, at desktop and at phone width.

    python3 .claude/skills/update-documentation/screenshot_tabs.py OUT_DIR

Headless Chrome will not make a window narrower than about 500px, so the
phone shots load the page inside a 400px iframe instead. Shots use the dark
theme; see SKILL.md for how to check the light one.

Headless Chrome sometimes stops responding altogether, hanging even on a
blank page. The script tries one blank page first, so that failure shows up
in seconds instead of as a timeout on every tab."""
import os, subprocess, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
SITE = os.path.join(ROOT, "17_Learning_As_Of_Now", "Claude")
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
FLAGS = ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-dark-mode",
         "--virtual-time-budget=3000"]

PAGES = [                       # (name, file, hash)
    ("home",            "index.html",     ""),
    ("mindmap",         "index.html",     "#map"),
    ("workspace",       "workspace.html", ""),
    ("journey",         "journey.html",   ""),
    ("chooser-start",   "chooser.html",   "#/start"),
    ("chooser-all",     "chooser.html",   "#/all"),
    ("chooser-verdict", "chooser.html",   "#/d/missing/1-0-0"),
]


def shot(out_png, url, width, height, profile, limit=60):
    """True when the screenshot was written within `limit` seconds."""
    try:
        subprocess.run([CHROME] + FLAGS +
                       [f"--user-data-dir={profile}", f"--window-size={width},{height}",
                        f"--screenshot={out_png}", url],
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=limit)
    except subprocess.TimeoutExpired:
        return False
    return os.path.exists(out_png) and os.path.getsize(out_png) > 0


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    out = os.path.abspath(sys.argv[1])
    os.makedirs(out, exist_ok=True)
    if not os.path.exists(CHROME):
        sys.exit("Google Chrome not found at " + CHROME)
    profile = os.path.join(out, ".chrome-profile")

    probe = os.path.join(out, "probe.html")
    with open(probe, "w", encoding="utf-8") as f:
        f.write("<h1>probe</h1>")
    if not shot(os.path.join(out, "probe.png"), "file://" + probe, 400, 300, profile, limit=25):
        sys.exit("Headless Chrome is not responding: it hangs even on a blank page, so no\n"
                 "tab was captured. Quit Google Chrome and try again. If it still hangs,\n"
                 "report that the visual check was skipped.")

    failed = []
    for name, page, frag in PAGES:
        url = "file://" + os.path.join(SITE, page) + frag
        desk = os.path.join(out, name + "-desktop.png")
        ok_desk = shot(desk, url, 1400, 2400, profile)

        wrap = os.path.join(out, name + "-phone.html")
        with open(wrap, "w", encoding="utf-8") as f:
            f.write('<body style="margin:0"><iframe src="' + url + '" '
                    'style="width:400px;height:2400px;border:0;display:block"></iframe></body>')
        phone = os.path.join(out, name + "-phone.png")
        ok_phone = shot(phone, "file://" + wrap, 520, 2400, profile)

        print(("   ok  " if ok_desk and ok_phone else " FAIL  ") + name + "  →  " + desk +
              "  +  -phone.png")
        if not (ok_desk and ok_phone):
            failed.append(name)

    if failed:
        sys.exit("could not capture: " + ", ".join(failed))


if __name__ == "__main__":
    main()
