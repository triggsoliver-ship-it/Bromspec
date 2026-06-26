# Bromspec Motorworks — Website

A fast, dark-premium, multi-page site for Bromspec Motorworks. No build tools, no
frameworks — just open the files. Everything is designed so **you can add your own
photos and videos without touching any code.**

## Pages
- `index.html` — Home (hero, services, brands, gallery, reviews, contact CTA)
- `services.html` — Full service detail + list
- `about.html` — Story, stats, Code of Practice
- `contact.html` — Contact details, booking form, map

## Viewing the site
Double-click `index.html` to open it in your browser. For the gallery auto-loader and
the map to work fully, it's best viewed through a simple local server:

```
# from inside this folder
python3 -m http.server 8000
# then visit http://localhost:8000
```

When the site goes live on real web hosting, everything works automatically.

---

## ✅ How to add your own PHOTOS and VIDEOS

### 1. Gallery (home page) — fully automatic
Drop image or video files into **`images/gallery/`** named in order:

```
images/gallery/01.jpg
images/gallery/02.jpg
images/gallery/03.png
images/gallery/04.mp4   ← videos work too
05.jpg, 06.jpg ...
```

Rules:
- **Number them in sequence** starting at `01`. The site shows them in order and
  stops at the first missing number (so don't skip numbers).
- Allowed image types: `.jpg .jpeg .png .webp .avif`
- Allowed video types: `.mp4 .webm .mov`
- That's it — refresh the page and they appear. No code editing.

### 2. Specific named images (hero & feature sections)
A few spots use a fixed filename so you can control exactly what shows. Just drop a
file with the matching name into the folder shown:

| What it's for                | Put the file here                  |
|------------------------------|------------------------------------|
| Hero background **video**    | `videos/hero.mp4`                  |
| Hero background **still**    | `images/hero.jpg`                  |
| Home feature video           | `videos/feature-1.mp4`             |
| Home feature image           | `images/workshop-1.jpg`            |
| Home "garage" image          | `images/workshop-2.jpg`            |
| Services — MOT               | `images/service-mot.jpg`           |
| Services — Diagnostics       | `images/service-diagnostics.jpg`   |
| Services — Servicing         | `images/service-servicing.jpg`     |
| About — team photo           | `images/team.jpg`                  |

If a named file isn't present, the site shows a tidy placeholder (or, for the hero,
an animated gradient) — so nothing ever looks broken while you gather photos.

### Tips
- Landscape photos around **1600px wide** look best and load fast.
- Keep hero video short (5–15s), muted, ideally under ~10MB.
- File names are case-sensitive on web servers — use lowercase.

---

## Editing text & details
Open any `.html` file in a text editor. Phone number, address and opening hours appear
near the top of `contact.html` and in the footer of `index.html`. Search for
`01264 315305` or `hello@bromspec.co.uk` to find contact details quickly.

## The enquiry form
The contact form is wired to **Web3Forms** and will email every submission to
**hello@bromspec.co.uk**. It validates Name, Email and a UK phone number before sending.

**One-time setup to switch it on:**
1. Go to https://web3forms.com and enter `hello@bromspec.co.uk`.
2. Copy the Access Key they give you.
3. Open `contact.html`, find `REPLACE_WITH_YOUR_WEB3FORMS_ACCESS_KEY` near the top of
   the form, and paste your key between the quotes.

Until the key is added, the form validates input and shows a friendly notice instead of
sending. No other code changes are needed.

## Blue Light discount
The home page (`index.html`) features a **10% off labour for Blue Light Card holders**
banner, just below the brand strip. Edit the wording in the `#bluelight` section of
`index.html`; its styling lives under `BLUE LIGHT` in `assets/css/style.css`.

## Design notes
- Colours, spacing and fonts are all defined at the top of `assets/css/style.css`
  under `:root` — change `--accent` to re-tint the whole site.
- Animations respect "reduce motion" accessibility settings automatically.
- Brand logos in the strip are simplified original emblems (in `assets/js/brands.js`).
