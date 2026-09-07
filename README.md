# Anuj Singh Devstudio — Full Stack Developer Portfolio

<p align="center">
  <img src="https://res.cloudinary.com/dhudpc4eu/image/upload/v1787555385/pixora-uploads/pixora-1787555385447-mlh7la.jpg" alt="Anuj Singh Portfolio Banner" width="100%" style="border-radius: 12px; max-height: 400px; object-fit: cover;" />
</p>

<p align="center">
  <strong>A high-performance, cinematic personal portfolio built with React 18, TypeScript, Vite, Tailwind CSS, Lenis, and Node.js.</strong>
</p>

<p align="center">
  <a href="https://anujsingh-developer.vercel.app/"><img src="https://img.shields.io/badge/Live_Demo-Vercel-black?style=for-the-badge&logo=vercel" alt="Live Demo" /></a>
  <a href="https://github.com/anujkumar013singh-oss"><img src="https://img.shields.io/badge/GitHub-anujkumar013singh--oss-181717?style=for-the-badge&logo=github" alt="GitHub" /></a>
  <a href="mailto:alonesurvivor03@gmail.com"><img src="https://img.shields.io/badge/Email-Contact_Me-EA4335?style=for-the-badge&logo=gmail&logoColor=white" alt="Email" /></a>
</p>

---

## 🌟 Overview

**Anuj Singh Devstudio** is a modern editorial and brutalist developer portfolio engineered for immersive user experience (UX) and fluid performance. It merges scroll-driven micro-animations, tactile physics, WebGL canvas effects, and rock-solid full-stack backend integrations.

---

## ✨ Key Features & UX Innovations

- **Tactile Smooth Scrolling (`Lenis`)**: Custom spring-physics smooth scrolling tuned for both high-refresh-rate desktop displays and mobile touch devices.
- **Interactive Fluid Simulation (`SplashCursor`)**: Real-time WebGL/Canvas fluid particle cursor effects that react dynamically to pointer velocity and touch gestures.
- **Scroll Stack Project Showcase (`SelectedWorks`)**: A multi-layered, GSAP & Lenis-powered 3D stacking card system with glowing `StarBorder` elements.
- **Dynamic Vector Bridge (`VectorBridge`)**: Procedural SVG bezier curves that physically connect the project showcase directly into the skills ecosystem as the user scrolls.
- **Infinite Marquee Tech Stack (`SkillsPhilosophy`)**: High-speed interactive category menus showcasing frontend, backend, and AI toolsets.
- **Swiss Grid Animated Metrics (`MagicBento`)**: Intersection-triggered counter telemetry tracking development hours, projects shipped, and engineering philosophy.
- **Robust Full-Stack Contact API**: Form submission with real-time input sanitization, Brevo transactional email delivery, and persistent MongoDB Atlas storage.
- **Parallax Reveal Footer**: Scrubbed typography scaling and colophon details embedded under a fixed depth layer.
- **Cross-Device Containerization (`Docker`)**: Multi-stage Docker and Docker Compose setup ensuring identical rendering and runtime behavior across all devices and hosting environments.

---

## 🚀 Featured Projects & Specializations

| Project | Live Demo | Core Tech Stack | Engineering Highlights |
| :--- | :--- | :--- | :--- |
| **001 · Velore** | [velore-fashion.vercel.app](https://velore-fashion.vercel.app/) | `MERN Stack`, `Stripe Payments`, `Auth`, `Tailwind CSS` | Full-stack fashion e-commerce platform featuring secure JWT authentication, dynamic collections, coupon system, and Stripe checkout. |
| **002 · Scorix** | [scorix-portal.vercel.app](https://scorix-portal.vercel.app/) | `PostgreSQL`, `PERN Stack`, `Neon Cloud`, `Admin Dashboard` | University examination portal with spreadsheet mark entry, automated PASS/BACKLOG evaluation, universal transcripts, and dispute resolution. |
| **003 · Clive Christen** | [clive-christen.vercel.app](https://clive-christen.vercel.app/) | `React`, `GSAP`, `ScrollTrigger`, `Tailwind CSS` | Luxury fragrance brand showcase featuring cinematic scroll synchronization, editorial typography, and high-performance transitions. |
| **004 · The Forge** | [the-forge-gym.vercel.app](https://the-forge-gym.vercel.app/) | `MERN Stack`, `Role Dashboards`, `Brevo API`, `Motion Graphics` | Full-stack gym management platform with role-based access control (RBAC), membership tiers, automated transactional emails, and financial telemetry. |

---

## 🛠️ Technology Stack

### Frontend Architecture
- **Framework & Core**: React 18, TypeScript, Vite
- **Styling & Layout**: Tailwind CSS, PostCSS, Radix UI Primitives, Lucide Icons
- **Animation & Motion**: Framer Motion, GSAP (GreenSock), ScrollTrigger
- **Scrolling Physics**: Lenis Smooth Scroll (`@studio-freight/lenis`, `lenis/react`)
- **Canvas / WebGL**: Custom OGL / WebGL fluid shaders

### Backend & Cloud Infrastructure
- **Server**: Node.js (ESM), Express.js
- **Database**: MongoDB Atlas (via Mongoose with cached connection pooling), PostgreSQL (Neon Cloud) & MySQL
- **Email Service**: Brevo (Sendinblue) Transactional SMTP REST API
- **Containerization**: Docker, Docker Compose, Nginx Alpine

---

## 🔍 SEO & Search Optimization

The site is fully optimized for search visibility with target brand keywords including **`Anuj Singh Devstudio`**, **`Anuj Singh portfolio`**, **`Anuj Singh developer`**, and **`Anuj Singh full stack developer`**:

- **Structured Data (JSON-LD)**: Embedded `Person` schema with `alternateName: "Anuj Singh Devstudio"`, job title, and verified social handles (`sameAs`).
- **Open Graph & Twitter Cards**: High-resolution social preview tags configured for seamless link previews on Twitter/X, LinkedIn, Discord, and Slack.
- **Indexing & Crawling**:
  - Validated XML Sitemap at [`/public/sitemap.xml`](/public/sitemap.xml)
  - Crawler permissions and sitemap reference configured in [`/public/robots.txt`](/public/robots.txt)
  - Google Search Console verification meta tag embedded in `<head>`.
  - Canonical URL declaration pointing to `https://anujsingh-developer.vercel.app/`.

---

## 📂 Project Structure

```text
Portfolio/
├── .env.local                  # Frontend local environment variables
├── .dockerignore               # Docker ignore rules for root
├── Dockerfile                  # Multi-stage Docker build (Node build -> Nginx Alpine)
├── docker-compose.yml          # Fullstack orchestration (Frontend + Backend)
├── nginx.conf                  # Nginx reverse proxy, gzip, caching & SPA routing
├── index.html                  # Main HTML entry with SEO, JSON-LD schema & Google fonts
├── package.json                # Frontend dependencies & build scripts
├── tailwind.config.ts          # Tailwind configuration & design tokens
├── vite.config.ts              # Vite configuration & dev proxy
├── public/
│   ├── robots.txt              # Search engine crawler instructions
│   └── sitemap.xml             # XML sitemap with route priorities
├── src/
│   ├── App.tsx                 # Root component with Lenis scroll provider & router
│   ├── index.css               # Global typography, layers, and CSS design system
│   ├── components/
│   │   ├── Navigation.tsx      # Fullscreen clip-path animated overlay menu
│   │   ├── SplashCursor.tsx    # WebGL fluid physics cursor simulation
│   │   ├── StarBorder.tsx      # SVG animated glowing gradient borders
│   │   └── ui/                 # Radix UI primitives & helper components
│   └── pages/
│       ├── Index.tsx           # Main orchestrator (Hero, Stack, Contact, Footer)
│       ├── About.tsx           # Background, education, experience & data section
│       ├── SelectedWorks.tsx   # 3D interactive stacking project cards
│       ├── VectorBridge.tsx    # SVG bezier vector transition line
│       ├── SkillsPhilosophy.tsx# Dynamic tech marquee & skills grid
│       ├── MagicBento.tsx      # Swiss telemetry metrics counters
│       ├── Contact.tsx         # Backend-connected contact form
│       └── Footer.tsx          # Parallax reveal colophon & branding
└── backend/
    ├── .env                    # Backend environment secrets (MongoDB, Brevo)
    ├── .env.example            # Environment variables template
    ├── .dockerignore           # Backend Docker ignore rules
    ├── Dockerfile              # Production Node.js Alpine container
    ├── package.json            # Backend dependencies (Express, Mongoose, Axios)
    ├── server.js               # Express server, CORS whitelist & health endpoints
    ├── routes/
    │   └── contact.js          # POST /api/contact handler with error boundaries
    └── services/
        ├── email.service.js    # Brevo email dispatch service
        └── mongo.service.js    # Mongoose connection caching & contact persistence
```

---

## 💻 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **bun**
- **Docker & Docker Compose** (optional for containerized execution)

---

### Option 1: Standard Local Development

#### 1. Clone the repository
```bash
git clone https://github.com/anujkumar013singh-oss/test.git
cd test
```

#### 2. Configure Environment Variables

**Frontend (`.env.local` in root):**
```env
VITE_BACKEND_URL=http://localhost:3500
```

**Backend (`backend/.env`):**
```env
PORT=3500
BACKEND_URL=http://localhost:3500
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/portfolio?retryWrites=true&w=majority
BREVO_API_KEY=xkeysib-your-brevo-api-key
MY_EMAIL=your-verified-email@gmail.com
NODE_ENV=development
```

#### 3. Install & Start Backend
```bash
cd backend
npm install
npm start
```
*Backend runs on `http://localhost:3500`*

#### 4. Install & Start Frontend (in a new terminal)
```bash
# In the root directory
npm install
npm run dev
```
*Frontend runs on `http://localhost:8080`*

---

### Option 2: Run with Docker & Docker Compose 🐳

Run the entire full-stack application (React frontend served with Nginx + Express backend + API proxying) with a single command:

```bash
# Build and start all services in detached mode
docker compose up --build -d
```

- **Frontend Application**: [`http://localhost:8080`](http://localhost:8080)
- **Backend API**: [`http://localhost:3500`](http://localhost:3500)
- **API Health Check**: [`http://localhost:3500/api/health`](http://localhost:3500/api/health)

To view real-time logs:
```bash
docker compose logs -f
```

To stop all containers:
```bash
docker compose down
```

---

## 🚀 Production Deployment

### Frontend (Vercel)
1. Import repository on [Vercel](https://vercel.com).
2. Set Build Command: `npm run build`
3. Set Output Directory: `dist`
4. Add Environment Variable: `VITE_BACKEND_URL=https://your-backend-url.onrender.com`

### Backend (Render / VPS)
1. Deploy `backend/` folder on [Render](https://render.com) or cloud VPS as a Web Service.
2. Build Command: `npm install`
3. Start Command: `npm start`
4. Set Environment Variables: `MONGO_URI`, `BREVO_API_KEY`, `MY_EMAIL`, `NODE_ENV=production`.

---

## 📜 License

Created with precision by **Anuj Singh** (2026). All rights reserved.
