<div align="center">

# Letterspace

### *Where Figma's math becomes your CSS.*

Type in the numbers from your Figma panel. Watch them turn into pixel-perfect CSS in real time. Copy. Paste. Ship.

[![Made with HTML](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](#tech-stack)
[![Made with CSS](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](#tech-stack)
[![Made with JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](#tech-stack)
[![Status](https://img.shields.io/badge/status-live-brightgreen)](https://github.com/Samanway-Koley/letterspace/)

[Live Demo](https://github.com/Samanway-Koley/letterspace/) · [Report a Bug](https://github.com/Samanway-Koley/letterspace/issues) · [Request a Feature](https://github.com/Samanway-Koley/letterspace/issues)

</div>

---

<img width="1070" height="665" alt="image" src="https://github.com/user-attachments/assets/4d7117d2-6110-4c01-a3d3-1c3aa23b651c" />

---

## The Story

Every designer knows the moment. You've dialed in the perfect headline in Figma — tight tracking, generous line height, exactly the rhythm you wanted. Then it hits the browser and something's *off*. A little looser. A little heavier. Close, but not quite it.

The culprit is unit translation. Figma speaks in **percentages**. CSS speaks in **pixels, ems, and unitless numbers**. Somewhere in that handoff, precision gets lost — usually to a developer eyeballing the conversion or rounding it "close enough."

**Letterspace exists to kill that gap.** Drop in your Figma values, get back the exact CSS, watch it render live before you even touch your editor.

---

## What It Does

**🔁 Converts both directions**
Go from Figma's `%` to CSS `px` — or flip it and reverse-engineer a percentage from existing CSS when you need to update a design system.

**🎛️ Feels like a real instrument**
Font size, letter spacing, and line height are all tied to sliders *and* number fields, so you can nudge values with a drag or dial them in with precision.

**⚡ Four presets, zero setup**
`Display`, `Heading`, `Body`, `Label` — jump straight to the type scale you're working in without re-entering numbers from scratch.

**👁️ Shows its work**
No black-box math. Every result comes with the calculation spelled out in plain sight, plus a live-rendered preview using your own sample text.

**📋 One click, fully copied**
Grab just the numbers or the full CSS declaration — either way, it's clipboard-ready and formatted to paste straight into a stylesheet.

**🕘 Remembers where you've been**
Recent conversions stick around in the session, so comparing a headline size against a body size doesn't mean starting over.

**📖 Comes with the "why," not just the "what"**
Built-in explainers on the logic behind the conversion, the handoff workflow, and an FAQ covering the type-system questions that come up over and over (px vs. em, negative tracking on display type, unitless line-height, and more).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Markup | Semantic HTML5 (`index.html`) |
| Styling | Custom CSS3 (`styles.css`), Google Fonts — Bricolage Grotesque, Inter, JetBrains Mono |
| Logic | Vanilla JavaScript (`app.js`), jQuery |
| CI/CD | GitHub Actions (`.github/workflows`) |

No frameworks. No build step. No `npm install` marathon. Just a static site that does exactly what it needs to.

---

## Project Structure

```
letterspace/
├── .github/
│   └── workflows/       # CI/CD configuration
├── images/               # Logo, favicon, and other assets
├── index.html            # Markup, metadata, structured data
├── styles.css             # Styling and animations
├── app.js                 # Conversion logic and UI interactivity
├── robots.txt             # Search engine crawling rules
├── sitemap.xml             # Sitemap
└── README.md
```

---

## Getting Started

Letterspace has no dependencies and no build process — it just runs.

**Clone it and open it:**

```bash
git clone https://github.com/Samanway-Koley/letterspace.git
cd letterspace
open index.html        # macOS
start index.html        # Windows
xdg-open index.html     # Linux
```

**Or serve it locally, if you'd rather:**

```bash
npx serve .
# or
python -m http.server
```

Then visit `http://localhost:<port>`.

**Deploying it:** since it's fully static, Letterspace drops straight onto GitHub Pages, Netlify, Vercel, or Cloudflare Pages — point the host at the repo root and it's live.

---

## Author

**Samanway Koley**

- GitHub: [@Samanway-Koley](https://github.com/Samanway-Koley)
- LinkedIn: [samanway-koley](https://www.linkedin.com/in/samanway-koley)
- Email: [samanwaykoley@gmail.com](mailto:samanwaykoley@gmail.com)

---

<div align="center">
<sub>Copyright © 2026 Letterspace.</sub>
</div>
