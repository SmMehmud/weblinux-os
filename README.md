# 🐧 WebLinux OS

A fully functional browser-based operating system with 70+ apps — built with pure HTML, CSS, and JavaScript.

## ✨ Features

- **Desktop Environment** — Draggable/resizable windows, taskbar, start menu, desktop icons
- **File System** — Virtual filesystem with Terminal, File Manager, Text Editor
- **70+ Apps** — Games, utilities, graphics, internet tools, calculators, and more
- **Persistent Storage** — Settings and files saved via localStorage

## 🗂️ Project Structure

```
weblinux-os/
├── index.html              ← Main entry point
├── package.json
├── vercel.json             ← Vercel deployment config
├── .gitignore
├── README.md
├── assets/
│   ├── css/
│   │   ├── base.css        ← CSS variables, reset, body
│   │   ├── desktop.css     ← Desktop, taskbar, start menu
│   │   ├── windows.css     ← Window system, context menu
│   │   └── apps.css        ← App-specific styles
│   └── js/
│       ├── core/
│       │   ├── helpers.js  ← $ and ce() utility functions
│       │   ├── os.js       ← Core OS object
│       │   ├── vfs.js      ← Virtual File System
│       │   └── window.js   ← Win and App base classes
│       ├── apps/
│       │   ├── system.js   ← Terminal, FileManager, Browser, etc.
│       │   ├── accessories.js ← Calculator, Notes, Markdown, etc.
│       │   ├── games.js    ← Snake, Tetris, Chess, etc.
│       │   ├── graphics.js ← Paint, Drawing, Fractal, etc.
│       │   ├── internet.js ← Weather, Chat, Email, Wikipedia, etc.
│       │   └── utilities.js ← BMI, Loan, Tip, Dice, etc.
│       └── main.js         ← App registration + OS init
└── server/
    └── server.js           ← Optional Node.js dev server
```

## 🚀 Deploy to Vercel

### Option 1 — Vercel CLI
```bash
npm install -g vercel
vercel
```

### Option 2 — GitHub + Vercel Dashboard
1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → Import Project
3. Select your GitHub repo
4. Click Deploy ✅

## 🛠️ Local Development

```bash
# Install dependencies (only needed for dev server)
npm install

# Run local server
npm start
# → Opens at http://localhost:3000
```

Or just open `index.html` directly in your browser — no server needed!

## 📦 Apps Included

| Category     | Apps |
|-------------|------|
| System      | Terminal, File Manager, Text Editor, Browser, Settings, Task Manager |
| Games       | Snake, Tetris, Chess, Sudoku, Minesweeper, Pong, 2048, Wordle, Flappy Bird, and more |
| Accessories | Calculator, Scientific Calc, Notes, Stopwatch, Timer, Calendar |
| Graphics    | Paint, Whiteboard, Image Viewer, Fractal Viewer, Color Picker |
| Internet    | Weather, Wikipedia, Chat, Email, QR Generator, IP Lookup |
| Utilities   | BMI Calc, Loan Calc, Tip Calc, Dice Roller, Coin Flip, Password Gen |

## 📄 License

MIT
