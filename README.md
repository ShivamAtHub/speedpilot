# SpeedPilot – YouTube Default Playback Speed Controller

SpeedPilot is a Chrome extension that automatically applies a user-defined playback speed to YouTube videos by default.
It is designed for users who regularly watch content at higher speeds and want a consistent, distraction-free experience without manually adjusting playback every time.

This project focuses on clean UI, predictable behavior in a real-world SPA (YouTube), and practical Chrome extension architecture using modern frontend tooling.


## FEATURES

- Set a global default playback speed for all YouTube videos
- Speed is automatically applied on video load
- Smart Resume support to restore speed after ads and buffering
- Clean, modern popup UI built with shadcn and Tailwind
- Real-time persistence using Chrome sync storage
- Minimal, focused UI with no unnecessary configuration
- Works seamlessly with YouTube’s single-page application navigation


## TECH STACK

- React (Hooks)
- Vite
- Tailwind CSS v4
- shadcn/ui
- Chrome Extension APIs (Manifest v3)
- JavaScript (ES Modules)


## PROJECT STRUCTURE

src/\
├── pages/\
│ ├── Home.jsx            - Main popup UI (speed control + toggles)\
│ └── Settings.jsx        - Extension behavior settings\
├── utils/\
│ └── storage.js          - Centralized Chrome storage handling\
├── App.jsx               - Routing only\
├── main.jsx              - React entry point\
├── index.css             - Tailwind v4 + design tokens\
├── vite.config.js\
└── public/\
  └── manifest.json       - Chrome extension manifest\

> App.jsx is intentionally kept minimal and handles routing only.  
> All UI logic lives inside page-level components to avoid unnecessary abstraction.


**Design decision:**
This is a single-purpose extension with a small surface area. UI logic is kept close to where it is used, and storage access is centralized to keep popup and content scripts consistent without overengineering.


## HOW IT WORKS

- The popup UI allows users to set their preferred default playback speed.
- Preferences are stored using `chrome.storage.sync`.
- A content script runs on YouTube pages and:
  - Detects the active `<video>` element
  - Applies the preferred playback speed
  - Re-applies the speed when YouTube dynamically loads a new video or after ads
- Smart Resume ensures the playback speed remains consistent despite YouTube resets.


## RUNNING THE PROJECT LOCALLY

**Prerequisites:**
- Node.js (v20 or higher recommended)
- npm

**Steps:**
```
git clone https://github.com/ShivamAtHub/speedpilot.git
cd speedpilot
npm install
npm run build
```

### Loading the Extension in Chrome
1. Open `chrome://extensions`
2. Enable **Developer Mode**
3. Click **Load unpacked**
4. Select the `dist/` folder
5. Pin the extension and open it from the toolbar

> Note: `npm run dev` is intended for UI iteration only.  
> Chrome extension APIs are available only when the extension is loaded via `chrome://extensions`.


## SUMMARY

This project demonstrates:
- Practical Chrome extension development with modern frontend tooling
- Handling of YouTube’s SPA behavior using DOM observation
- Clean separation between UI, storage, and content logic
- Attention to UX for a high-frequency, real-world user interaction
- A focused, maintainable codebase without unnecessary complexity

The implementation prioritizes reliability, clarity, and user experience over feature bloat.


## AUTHOR

[GitHub](https://github.com/ShivamAtHub)  
[LinkedIn](https://www.linkedin.com/in/shivamdarekar2206/)