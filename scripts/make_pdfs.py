"""Make the invitation PDFs from the site's own cards.

  output/Vivek-Shivani-<Event>-Invitation.pdf      one per event
  output/Vivek-Shivani-Wedding-Invitations-Complete.pdf   cover page + every invitation

Every card page has two tappable buttons: Add to Calendar (opens the site's /#/add/<event> page, which
picks the right calendar for the phone) and Directions (the venue's Maps link).

Steps (see README in this folder's header comments):
  node scripts/export-events.mjs        -> scripts/events.json  (from src/events.ts)
  python scripts/capture_server.py      -> then open  #/card/<slug>  captures into output/cards/
  python scripts/make_pdfs.py
"""
import json
from datetime import datetime, timedelta, timezone
from pathlib import Path
from urllib.parse import quote

from PIL import Image
from reportlab.lib.colors import HexColor
from reportlab.lib.utils import simpleSplit
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "output"
SITE = "https://vivani-wedding-celebs.web.app"   # overwritten from src/events.ts (SITE_URL) in main()
IST = timezone(timedelta(hours=5, minutes=30))

W, M = 560, 16
CW = W - 2 * M
CREAM, PAPER = HexColor("#FDF1EE"), HexColor("#FFFAF8")
ROSE, ROSE_DARK = HexColor("#C98C88"), HexColor("#9E5E5B")
BROWN, SCRIPT_C, LINE = HexColor("#6A4545"), HexColor("#A0626A"), HexColor("#EBCFCB")
WHITE = HexColor("#FFFFFF")


def fonts():
    want = {"Script": "ITCEDSCR.TTF", "Serif": "pala.ttf", "Serif-Bold": "palab.ttf", "Serif-Italic": "palai.ttf"}
    try:
        for name, file in want.items():
            pdfmetrics.registerFont(TTFont(name, f"C:/Windows/Fonts/{file}"))
        return {"script": "Script", "reg": "Serif", "bold": "Serif-Bold", "ital": "Serif-Italic", "k": 1.25}
    except Exception:
        return {"script": "Times-Italic", "reg": "Times-Roman", "bold": "Times-Bold", "ital": "Times-Italic", "k": 1.0}


F = fonts()


def dt(local):
    return datetime.fromisoformat(local).replace(tzinfo=IST)


def day_label(e):
    return dt(e["start"]).strftime("%A, %d %B %Y").replace(" 0", " ")


def short_day(e):
    return dt(e["start"]).strftime("%a, %d %b").replace(" 0", " ")


# ---------- drawing helpers ----------
def spaced(c, text, cx, y, font, size, spacing, color):
    width = c.stringWidth(text, font, size) + spacing * (len(text) - 1)
    t = c.beginText(cx - width / 2, y)
    t.setFont(font, size); t.setCharSpace(spacing); t.setFillColor(color)
    t.textOut(text); t.setCharSpace(0)
    c.drawText(t)


def script_text(c, text, cx, y, size, max_w, color):
    size *= F["k"]
    while c.stringWidth(text, F["script"], size) > max_w:
        size *= 0.95
    c.setFillColor(color); c.setFont(F["script"], size)
    c.drawCentredString(cx, y, text)


def pin_icon(c, cx, cy, s, color, hole):
    c.setFillColor(color)
    p = c.beginPath(); p.moveTo(cx, cy - s * .55); p.lineTo(cx - s * .33, cy + s * .02); p.lineTo(cx + s * .33, cy + s * .02); p.close()
    c.drawPath(p, fill=1, stroke=0)
    c.circle(cx, cy + s * .12, s * .36, fill=1, stroke=0)
    c.setFillColor(hole); c.circle(cx, cy + s * .12, s * .14, fill=1, stroke=0)


def calendar_icon(c, cx, cy, s, color, hole):
    w, h = s * .9, s * .8
    x, y = cx - w / 2, cy - h / 2
    c.setStrokeColor(color); c.setFillColor(color); c.setLineWidth(1.4)
    c.roundRect(x, y, w, h, 2, fill=0, stroke=1)
    c.rect(x, y + h * .68, w, h * .32, fill=1, stroke=0)
    for i in (.3, .7):
        c.line(x + w * i, y + h, x + w * i, y + h + s * .14)
    for row in range(2):
        for col in range(3):
            c.rect(x + w * (.17 + col * .25), y + h * (.14 + row * .25), w * .13, h * .13, fill=1, stroke=0)


def button(c, x, y, w, h, label, icon, url, solid, size=17):
    if solid:
        c.setFillColor(ROSE_DARK); c.roundRect(x, y - 3, w, h, h / 2, fill=1, stroke=0)
        c.setFillColor(ROSE); c.roundRect(x, y, w, h, h / 2, fill=1, stroke=0)
        fg, hole = WHITE, ROSE
    else:
        c.setStrokeColor(ROSE); c.setLineWidth(2)
        c.roundRect(x + 1, y + 1, w - 2, h - 2, (h - 2) / 2, fill=0, stroke=1)
        fg, hole = ROSE_DARK, PAPER
    icon_s = 19 if size > 14 else 13
    tw = c.stringWidth(label, F["bold"], size)
    start = x + (w - (icon_s + 8 + tw)) / 2
    icon(c, start + icon_s / 2, y + h / 2, icon_s, fg, hole)
    c.setFillColor(fg); c.setFont(F["bold"], size)
    c.drawString(start + icon_s + 8, y + h / 2 - size * .32, label)
    c.linkURL(url, (x, y - (3 if solid else 0), x + w, y + h), relative=0, thickness=0)


def shadow_card(c, x, y, w, h, r, fill=PAPER, border=LINE):
    for grow, alpha in ((14, .02), (9, .03), (5, .045)):
        c.saveState(); c.setFillColor(BROWN); c.setFillAlpha(alpha)
        c.roundRect(x - grow + 2, y - grow - 6, w + 2 * (grow - 2), h + 2 * (grow - 2), r + grow / 2, fill=1, stroke=0)
        c.restoreState()
    c.setFillColor(fill); c.setStrokeColor(border); c.setLineWidth(1)
    c.roundRect(x, y, w, h, r, fill=1, stroke=1)


def background(c, h):
    c.setFillColor(CREAM); c.rect(0, 0, W, h, fill=1, stroke=0)
    c.saveState(); c.setFillColor(HexColor("#FBE3DF")); c.setFillAlpha(.55)
    c.circle(W, h * .62, 220, fill=1, stroke=0)
    c.restoreState()


# ---------- one invitation page ----------
def card_path(e):
    if e["card"] == "image":
        return ROOT / "public" / e["art"].lstrip("/")      # finished cards are used as they are
    return OUT / "cards" / f"{e['slug']}.png"


def card_size(e):
    with Image.open(card_path(e)) as im:
        return im.size


def page_height(e):
    iw, ih = card_size(e)
    return M + CW * ih / iw + 22 + 54 + 20 + 70


def draw_event_page(c, e):
    iw, ih = card_size(e)
    card_h = CW * ih / iw
    H = page_height(e)
    c.setPageSize((W, H))
    background(c, H)

    top = H - M
    x = M
    shadow_card(c, x, top - card_h, CW, card_h, 20)
    c.saveState()
    clip = c.beginPath(); clip.roundRect(x, top - card_h, CW, card_h, 20); c.clipPath(clip, stroke=0, fill=0)
    c.drawImage(str(card_path(e)), x, top - card_h, width=CW, height=card_h)
    c.restoreState()
    c.setStrokeColor(LINE); c.setLineWidth(1); c.roundRect(x, top - card_h, CW, card_h, 20, fill=0, stroke=1)

    by = top - card_h - 22 - 54
    gap = 12
    bw = (CW - gap) / 2
    button(c, x, by, bw, 54, "Add to Calendar", calendar_icon, f"{SITE}/#/add/{e['slug']}", True)
    button(c, x + bw + gap, by, bw, 54, "Directions", pin_icon, e["maps"], False)

    c.setFillColor(BROWN); c.setFont(F["ital"], 12.5)
    c.drawCentredString(W / 2, by - 24, f"{e['name']}  ·  {short_day(e)}  ·  {e['time']}")
    c.setFont(F["reg"], 11.5)
    c.drawCentredString(W / 2, by - 42, f"{e['venue']}, {e['address']}"[:95])
    c.showPage()


# ---------- cover page for the complete PDF ----------
def draw_cover(c, events, couple, range_text):
    row_h, gap = 92, 12
    H = 330 + len(events) * (row_h + gap) + 80
    c.setPageSize((W, H))
    background(c, H)
    cx = W / 2
    spaced(c, "TOGETHER WITH OUR FAMILIES", cx, H - 56, F["bold"], 13, 2.9, ROSE_DARK)
    script_text(c, couple, cx, H - 122, 64, CW - 40, SCRIPT_C)
    spaced(c, "INVITE YOU TO OUR WEDDING CELEBRATIONS", cx, H - 152, F["bold"], 12.5, 2.6, ROSE_DARK)
    c.setStrokeColor(ROSE); c.setLineWidth(1)
    c.line(cx - 120, H - 182, cx - 12, H - 182); c.line(cx + 12, H - 182, cx + 120, H - 182)
    c.setFillColor(ROSE); c.circle(cx, H - 182, 3.2, fill=1, stroke=0)
    c.setFillColor(BROWN); c.setFont(F["bold"], 20)
    c.drawCentredString(cx, H - 214, range_text)
    bw = 300
    button(c, cx - bw / 2, H - 214 - 24 - 54, bw, 54, "Add all events to calendar", calendar_icon, f"{SITE}/#/add", True)

    y = H - 322
    for e in events:
        y -= row_h
        shadow_card(c, M, y, CW, row_h, 18)
        c.setFillColor(SCRIPT_C); c.setFont(F["script"], 30 * F["k"] if len(e["name"]) < 14 else 25 * F["k"])
        c.drawString(M + 20, y + row_h - 36, e["name"])
        c.setFillColor(BROWN); c.setFont(F["bold"], 13.5)
        c.drawString(M + 20, y + 34, f"{short_day(e)}  ·  {e['time']}")
        c.setFont(F["reg"], 12)
        place = e["venue"] + (", " + e["address"] if len(e["address"]) <= 40 else "")
        c.drawString(M + 20, y + 16, place[:72])
        # the same two buttons as on each invitation, small, on every row
        bx, bw2, bh = M + CW - 18 - 136, 136, 28
        button(c, bx, y + row_h - 14 - bh - 2, bw2, bh, "Add to Calendar", calendar_icon, f"{SITE}/#/add/{e['slug']}", True, size=11.5)
        button(c, bx, y + 16, bw2, bh, "Directions", pin_icon, e["maps"], False, size=11.5)
        c.linkURL(f"{SITE}/#/{e['slug']}", (M, y, bx - 8, y + row_h), relative=0, thickness=0)   # tap the text to open the invitation online
        y -= gap
    c.setFillColor(ROSE_DARK); c.setFont(F["reg"], 15)
    c.drawCentredString(cx, 36, f"With love, {couple}")
    c.showPage()


def main():
    global SITE
    cfg = json.loads((ROOT / "scripts" / "events.json").read_text(encoding="utf-8"))
    SITE = cfg.get("site", SITE).rstrip("/")
    events = sorted(cfg["events"], key=lambda e: e["start"])
    couple = f"{cfg['couple']['a']} & {cfg['couple']['b']}"
    missing = [e["slug"] for e in events if not card_path(e).exists()]
    if missing:
        raise SystemExit(f"Missing card images for: {', '.join(missing)} (run the capture step first)")

    OUT.mkdir(exist_ok=True)
    for e in events:
        out = OUT / f"Vivek-Shivani-{e['name'].replace(' & ', '-and-').replace(' ', '-')}-Invitation.pdf"
        c = canvas.Canvas(str(out), pagesize=(W, 100))
        c.setTitle(f"{e['name']} – {couple}"); c.setAuthor(couple)
        draw_event_page(c, e)
        c.save()
        print("saved", out.name)

    first, last = dt(events[0]["start"]), dt(events[-1]["start"])
    rng = f"{first.day} – {last.strftime('%d %B %Y').lstrip('0')}"
    out = OUT / "Vivek-Shivani-Wedding-Invitations-Complete.pdf"
    c = canvas.Canvas(str(out), pagesize=(W, 100))
    c.setTitle(f"{couple} – Wedding Invitations"); c.setAuthor(couple)
    draw_cover(c, events, couple, rng)
    for e in events:
        draw_event_page(c, e)
    c.save()
    print("saved", out.name)


if __name__ == "__main__":
    main()
