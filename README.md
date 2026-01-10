# 🧠 FlashCraft - Study Smarter, Not Harder

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Go](https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white)](https://go.dev/)
[![Fiber](https://img.shields.io/badge/Fiber-00ADD8?style=for-the-badge&logo=gofiber&logoColor=white)](https://gofiber.io/)
[![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**FlashCraft** is a high-performance, full-stack application designed to help students and professionals master any subject using an intelligent Spaced Repetition System (SRS). Built with a focus on speed, refined UI/UX, and security.

---

## ✨ Features

- **🚀 Intelligent Study Mode**: Uses the **SM2 algorithm** (SuperMemo-2) to schedule reviews exactly when you're about to forget them.
- **📁 Organized Library**: Manage your learning journey with nested folders and tag-like categorization.
- **🎨 Premium UI/UX**: 
  - Smooth 3D-effect card flips.
  - Dark/Light mode support.
  - Responsive design for mobile and desktop.
  - Interactive animations with Framer Motion.
- **🔒 Secure Authentication**: JWT-based auth system with bcrypt password hashing and rate-limited endpoints.
- **⚡ Blazing Fast**: Go-powered backend providing sub-millisecond API responses.
- **📦 Zero-Config Storage**: Local SQLite database for easy deployment and portability.

---

## 🛠️ Tech Stack

### Frontend
- **React 18** + **TypeScript**
- **Vite** (Build Tool)
- **Tailwind CSS** + **DaisyUI**
- **React Query** (State Management & Caching)
- **Zustand** (Auth persistence)
- **Lucide React** (Iconography)

### Backend
- **Go** (Golang)
- **Fiber v2** (Web Framework)
- **GORM** (ORM)
- **SQLite** (Database)
- **JWT** (Authentication)

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Go](https://go.dev/) (v1.20+)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create your `.env` file:
   ```bash
   cp .env.example .env
   ```
3. Run the server:
   ```bash
   go run .
   ```

### Frontend Setup
1. Navigate to the root directory:
   ```bash
   npm install
   ```
2. Create your `.env` file:
   ```bash
   cp .env.example .env
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🔐 Security & Production Notes

- **Environment Variables**: Always use `.env` files for production secrets (JWT secrets, API URLs).
- **Rate Limiting**: The backend is protected by a 20-req/30s rate limit on all endpoints to prevent abuse.
- **CORS**: Ensure `ALLOWED_ORIGINS` in your backend `.env` matches your frontend production URL.

---

## 📜 License
Distributed under the MIT License. See `LICENSE` for more information.

---

Designed with ❤️ for lifelong learners.
