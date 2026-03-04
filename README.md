# FlashCraft - Study Smarter, Not Harder

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Go](https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white)](https://go.dev/)
[![Fiber](https://img.shields.io/badge/Fiber-00ADD8?style=for-the-badge&logo=gofiber&logoColor=white)](https://gofiber.io/)
[![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**FlashCraft** is a high-performance, full-stack application designed to help students and professionals master any subject using an intelligent Spaced Repetition System (SRS). Built with a focus on speed, refined UI/UX, and security.

---

## Features

- **Frontend Excellence**: Built with **React 18**, **TypeScript**, and **Framer Motion** for smooth 3D card flips and a cinematic user experience.
- **Intelligent SRS**: Integrated **SM-2 Algorithm** that dynamically schedules reviews based on your memory performance.
- **Go Backend**: High-performance **Go (Fiber)** server providing sub-millisecond API responses and robust routing.
- **Database Power**: **SQLite** storage with **GORM**, ensuring data integrity for flashcards, folders, and SRS metrics in a portable file.
- **Security First**: JWT-based authentication, Bcrypt password hashing, and built-in rate-limiting protection.
- **Theming**: Seamless **Dark and Light mode** support using Tailwind CSS and DaisyUI.

---

## Visual Showcase

| Home Page (Dark) | Home Page (Light) |
| :---: | :---: |
| ![Home Dark](./src/assets/presentitive_image.png) | ![Home Light](./src/assets/presentative_image2.png) |

| Authentication | Dashboard View |
| :---: | :---: |
| ![Login](./src/assets/presentative_image3.png) | ![Dashboard](./src/assets/presentative_image4.png) |

| Create Flashcard | Edit Flashcard |
| :---: | :---: |
| ![Create](./src/assets/presentative_image5.png) | ![Edit](./src/assets/presentative_image6.png) |

| Study Mode (Question) | Study Mode (Rating) |
| :---: | :---: |
| ![Study 1](./src/assets/presentative_image7.png) | ![Study 2](./src/assets/presentative_image8.png) |

---

## Tech Stack

### Frontend
- **React 18 & TypeScript** - Foundation of the UI logic.
- **Vite** - Lightning-fast build tool and development server.
- **Tailwind CSS & DaisyUI** - Utility-first styling with a rich component library.
- **React Query** - Robust server state management.
- **Framer Motion** - Cinematic 3D animations.
- **Zustand** - Global state for authentication.

### Backend
- **Go (Golang)** - Core language for performance.
- **Fiber v2** - Express-like web framework for Go.
- **SQLite** - Durable, zero-config relational database.
- **GORM** - Developer-friendly ORM for database operations.
- **JWT & Bcrypt** - Industry-standard security layers.

---

## Getting Started

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
2. Create your `.env` file (if needed):
   ```bash
   cp .env.example .env
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## License
Distributed under the MIT License. See `LICENSE` for more information.

---

Designed with heart for lifelong learners.

