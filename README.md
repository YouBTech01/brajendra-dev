<div align="center">

<img src="public/brand/logo.webp" alt="You B Tech logo" width="96" height="96" style="border-radius:50%" />

# Brajendra (BKC) Portfolio

**The whole website is an iPhone.** Lock screen, home screen widgets, Focus settings, folders, reels, notifications and iMessage, in Liquid Glass.

![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Motion](https://img.shields.io/badge/Motion-000000?style=for-the-badge&logo=framer&logoColor=white)
![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)

</div>

<p align="center">
  <img src="docs/screenshots/desktop-hero.webp" alt="Lock screen hero" width="78%" />
  <img src="docs/screenshots/mobile-hero.webp" alt="Lock screen on mobile" width="19%" />
</p>

## About

Portfolio of **Brajendra**, 19+, a developer, YouTuber and tech creator from Madhya Pradesh, India. He builds apps and teaches tech on the **You B Tech** channel (7.3M+ views).

## Languages and tools

**Languages**

<p>
  <img src="https://skillicons.dev/icons?i=dart,kotlin,java,python,js,html,css&theme=light" alt="Dart, Kotlin, Java, Python, JavaScript, HTML, CSS" />
</p>

| | Language | Used for |
| --- | --- | --- |
| <img src="https://skillicons.dev/icons?i=dart" width="32" /> | Dart | Flutter apps |
| <img src="https://skillicons.dev/icons?i=kotlin" width="32" /> | Kotlin | Android native |
| <img src="https://skillicons.dev/icons?i=java" width="32" /> | Java | Android native |
| <img src="https://skillicons.dev/icons?i=python" width="32" /> | Python | Automation and AI agents |
| <img src="https://skillicons.dev/icons?i=js" width="32" /> | JavaScript | Web apps and this site |
| <img src="https://skillicons.dev/icons?i=html" width="32" /> | HTML | Web pages and chatbots |
| <img src="https://skillicons.dev/icons?i=css" width="32" /> | CSS | Layout and animation |

**Frameworks and tools**

<p>
  <img src="https://skillicons.dev/icons?i=flutter,android,react,vite,git,github,netlify&theme=light" alt="Flutter, Android, React, Vite, Git, GitHub, Netlify" />
</p>

**Skill levels**

| Skill | Level |
| --- | --- |
| Tech tutorials | 95% |
| AI and prompt engineering | 85% |
| Backend development | 71% |
| Android native | 57% |
| Frontend development | 45% |
| Python development | 23% |
| Flutter development | 21% |

## Screenshots

### Desktop

| Home screen | Focus |
| --- | --- |
| ![Home](docs/screenshots/desktop-home.webp) | ![Focus](docs/screenshots/desktop-focus.webp) |

| Skills | Projects |
| --- | --- |
| ![Skills](docs/screenshots/desktop-skills.webp) | ![Projects](docs/screenshots/desktop-projects.webp) |

| Channel | Social |
| --- | --- |
| ![Channel](docs/screenshots/desktop-channel.webp) | ![Social](docs/screenshots/desktop-social.webp) |

| Contact | Dark mode |
| --- | --- |
| ![Contact](docs/screenshots/desktop-contact.webp) | ![Dark mode](docs/screenshots/dark-home.webp) |

### Mobile

<p align="center">
  <img src="docs/screenshots/mobile-home.webp" width="23%" alt="Home" />
  <img src="docs/screenshots/mobile-focus.webp" width="23%" alt="Focus" />
  <img src="docs/screenshots/mobile-skills.webp" width="23%" alt="Skills" />
  <img src="docs/screenshots/mobile-projects.webp" width="23%" alt="Projects" />
</p>
<p align="center">
  <img src="docs/screenshots/mobile-channel.webp" width="23%" alt="Channel" />
  <img src="docs/screenshots/mobile-social.webp" width="23%" alt="Social" />
  <img src="docs/screenshots/mobile-contact.webp" width="23%" alt="Contact" />
</p>

## Features

- **Lock screen hero** with a live clock, a notification and swipe up to unlock.
- **Home screen widgets**: profile card, YouTube views graph, a real Madhya Pradesh map, achievements and hobbies.
- **iOS bottom sheets** for skill folders, and a Focus settings list.
- **Project reels inside a phone**: 6 top GitHub repos plus a "50+ projects" YouTube slide.
- **Channel deck**: swipe through YouTube, Instagram, Telegram and GitHub app screens.
- **Social notifications** that arrive one at a time, and an iMessage style contact thread.
- **Liquid Glass** material, light and dark mode, and a moving sky-blue background.
- **Sound effects** on interactions with one voice at a time, so sounds never overlap.
- **Boot screen** that preloads sounds, fonts and images so scrolling stays smooth afterwards.
- **Responsive** for phones and desktops, and opens full screen on mobile after the first tap.

## Views and likes (mini JSON database)

The footer shows **website views** and a **like** button (tap again to remove your like). The numbers are one small JSON document, `{ "views": 0, "likes": 0 }`:

- **Live on Netlify:** `netlify/functions/stats.mjs` keeps it in Netlify Blobs at `/api/stats`. Writes use the document's etag, so visitors at the same moment never overwrite each other.
- **Local (`npm run dev` / `npm run preview`):** the same API is served by `server/vite-stats.js` and stored in `data/stats.json`.
- One view is counted per browser session, and one like per visitor (kept in `localStorage`).

## Tech stack

| | |
| --- | --- |
| <img src="https://skillicons.dev/icons?i=react" width="28" /> | React 19 |
| <img src="https://skillicons.dev/icons?i=vite" width="28" /> | Vite |
| <img src="https://skillicons.dev/icons?i=css" width="28" /> | Plain CSS (no Tailwind) |
| | `motion` for animation, `lenis` for smooth scroll, Iconify for icons, Web Audio for sound |

## Run locally

```bash
npm install
npm run dev
```

## Build and deploy

```bash
npm run build     # outputs to dist/
npm run preview   # serve the production build locally
```

`dist/` is a static site, so it works on Netlify, Vercel, Cloudflare Pages or GitHub Pages. A `netlify.toml` is included.

## Links

[![YouTube](https://img.shields.io/badge/YouTube-You_B_Tech-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtube.com/@You_B_Tech)
[![GitHub](https://img.shields.io/badge/GitHub-YouBTech01-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/YouBTech01)
[![Instagram](https://img.shields.io/badge/Instagram-you__b__tech-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/you_b_tech)
[![Telegram](https://img.shields.io/badge/Telegram-YouBTech-26A5E4?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/YouBTech)
[![Website](https://img.shields.io/badge/Website-ybtshop.com-0A84FF?style=for-the-badge&logo=safari&logoColor=white)](https://ybtshop.com)
