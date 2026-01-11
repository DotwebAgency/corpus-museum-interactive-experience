<p align="center">
  <img src="https://raw.githubusercontent.com/DotwebAgency/corpus-museum-interactive-experience/main/assets/logo.svg" width="120" height="120" alt="CORPUS Logo">
</p>

<h1 align="center">CORPUS</h1>

<p align="center">
  <strong>Behold the form.</strong><br>
  A living digital portrait in the tradition of the Old Masters.
</p>

<p align="center">
  <a href="https://corpus-interactive.netlify.app">🎨 Live Demo</a> ·
  <a href="#features">Features</a> ·
  <a href="#installation">Installation</a> ·
  <a href="#usage">Usage</a> ·
  <a href="#technology">Technology</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/MediaPipe-0.10.18-blue?style=flat-square" alt="MediaPipe Version">
  <img src="https://img.shields.io/badge/GSAP-3.12.5-green?style=flat-square" alt="GSAP Version">
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square" alt="License">
  <img src="https://img.shields.io/badge/Made%20with-JavaScript-orange?style=flat-square" alt="JavaScript">
</p>

---

## ✨ Overview

**CORPUS** is an immersive, real-time human body visualization experience that transforms your webcam feed into a museum-quality digital portrait. Inspired by Leonardo da Vinci's anatomical studies and Baroque master paintings, it renders your skeleton, face mesh, and hand gestures as ethereal pastel art.

See yourself rendered as timeless art — all processing happens locally on your device, ensuring complete privacy.

<p align="center">
  <img src="https://raw.githubusercontent.com/DotwebAgency/corpus-museum-interactive-experience/main/assets/preview.gif" width="600" alt="CORPUS Preview">
</p>

---

## 🎭 Features

### Real-Time Body Tracking
- **33 Body Landmarks** — Full skeleton visualization from head to toe
- **468 Face Landmarks** — Detailed face mesh with eyes, lips, nose, and contours
- **42 Hand Landmarks** — 21 per hand with precise finger tracking
- **Native Gesture Recognition** — Closed Fist, Open Palm, Pointing, and more

### Interactive Particle System
- **Spark Effect** — Close your fist to emit golden petals from your hands
- **Wind Push** — Open palm pushes particles away
- **Magnet Attraction** — Point to attract particles to your fingertip
- **Body Collision** — Particles interact with your skeleton in real-time

### Museum-Quality Aesthetics
- **Baroque Pastel Palette** — Rose blush, powder blue, mint cream, lavender
- **Dual Theme Support** — Dark gallery mode & light exhibition mode
- **Cinema Mode** — Press `F` for fullscreen immersive experience
- **GSAP Animations** — Smooth, orchestrated UI transitions

### Privacy First
- **100% Local Processing** — No data leaves your device
- **No Server Required** — Runs entirely in the browser
- **GPU Accelerated** — WebGL delegate for smooth performance

---

## 🚀 Live Demo

Experience CORPUS live at:

**[https://corpus-interactive.netlify.app](https://corpus-interactive.netlify.app)**

> **Requirements:** Modern browser with webcam access (Chrome, Edge, Firefox, Safari)

---

## 💻 Installation

### Option 1: Clone & Serve

```bash
# Clone the repository
git clone https://github.com/DotwebAgency/corpus-museum-interactive-experience.git

# Navigate to project
cd corpus-museum-interactive-experience

# Serve with any static server (examples below)

# Using Python
python -m http.server 3000

# Using Node.js
npx serve

# Using PHP
php -S localhost:3000
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

### Option 2: Direct Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/DotwebAgency/corpus-museum-interactive-experience)

---

## 🎮 Usage

### Getting Started
1. Click **"Begin the Sitting"** to enable your camera
2. Position yourself as you would for a portrait
3. Wait for the "AWAKENING" loading sequence to complete

### Gestures

| Gesture | Action | Description |
|---------|--------|-------------|
| ✊ **Closed Fist** | Spark Effect | Emit golden petals from your hand |
| ✋ **Open Palm** | Wind Push | Push particles away from your palm |
| ☝️ **Pointing Up** | Magnet | Attract particles to your fingertip |
| 🖐️ **Wave** | Natural Motion | Watch particles react to your movement |

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `F` | Toggle fullscreen Cinema Mode |
| `Escape` | Exit Cinema Mode |
| `Space` | Begin experience (on intro screen) |

### Theme Toggle
Click the sun/moon icon in the header to switch between dark and light themes.

---

## 🛠️ Technology

### Core Stack
- **MediaPipe Tasks Vision** `v0.10.18` — ML-powered pose, face, and hand detection
- **GSAP** `v3.12.5` — Professional-grade animations
- **Vanilla JavaScript** — ES6 modules, no framework dependencies

### MediaPipe Models
| Model | Landmarks | Purpose |
|-------|-----------|---------|
| Pose Landmarker (Heavy) | 33 | Full body skeleton |
| Face Landmarker | 468 + 52 blendshapes | Face mesh & expressions |
| Gesture Recognizer | 21 per hand + 7 gestures | Hand tracking & gesture detection |

### Architecture
```
corpus-museum-interactive-experience/
├── index.html              # Single page application
├── styles/
│   └── main.css            # Complete styling (1800+ lines)
├── js/
│   ├── app.js              # Main application controller
│   ├── mediapipe-tracker.js # MediaPipe integration
│   ├── human-avatar.js     # Skeleton & face rendering
│   ├── interactive-particles.js # Petal particle system
│   ├── animations.js       # GSAP animation orchestration
│   └── themes.js           # Color theme definitions
└── netlify.toml            # Deployment configuration
```

---

## 🎨 Design Philosophy

CORPUS draws inspiration from:

- **Leonardo da Vinci** — Vitruvian Man, anatomical precision
- **Old Master Paintings** — Baroque chiaroscuro, warm tones
- **Museum Installations** — Gallery-quality presentation
- **Swiss Typography** — Clean, readable information design

The palette intentionally uses soft, ethereal pastels:
- Rose Blush `#E8B4B8`
- Powder Blue `#A8C8DC`
- Mint Cream `#A8D0BC`
- Lavender `#C8B8D8`
- Antique Gold `#C9A050`

---

## 📊 Performance

| Metric | Target | Actual |
|--------|--------|--------|
| Frame Rate | 60 FPS | 55-60 FPS (GPU) |
| Latency | <50ms | ~30ms |
| Memory | <200MB | ~150MB |
| Particles | 400 max | Configurable |

> Performance varies by device. GPU acceleration via WebGL is recommended.

---

## 🔧 Configuration

Key settings in `js/human-avatar.js`:

```javascript
// Adjust smoothing (0.0 = responsive, 1.0 = smooth)
this.smoothFactor = 0.22;

// Particle system limits
this.petalStream.config.maxParticles = 400;
this.petalStream.config.spawnRate = 0.95;

// Enable debug zones
this.setDebugZones(true);
```

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [MediaPipe](https://developers.google.com/mediapipe) — Google's ML solutions
- [GSAP](https://greensock.com/gsap/) — GreenSock Animation Platform
- [Louvre Museum](https://www.louvre.fr/) — Aesthetic inspiration

---

<p align="center">
  <strong>CORPUS · MMXXVI</strong><br>
  <em>Memento vivere</em>
</p>

<p align="center">
  Made with ❤️ by <a href="https://github.com/DotwebAgency">DotwebAgency</a>
</p>