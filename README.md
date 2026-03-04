# FlashCraft - Study Smarter, Not Harder

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Go](https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white)](https://go.dev/)
[![Fiber](https://img.shields.io/badge/Fiber-00ADD8?style=for-the-badge&logo=gofiber&logoColor=white)](https://gofiber.io/)
[![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**FlashCraft** is a high-performance, full-stack application designed to help students and professionals master any subject using an intelligent Spaced Repetition System (SRS). Built with a focus on speed, refined UI/UX, and security.

---

## Features & Functionality

### Frontend Excellence
The frontend is built with **React 18** and **TypeScript**, focusing on a seamless user experience:
- **Intelligent Study Mode**: Powered by the **SM-2 Algorithm**, the UI dynamically schedules cards. It calculates the next review date based on your performance, which is then persisted in the database.
- **Dynamic UI with Framer Motion**: 
  - **Smooth Card Flips**: Realistic 3D animations when revealing the back of a flashcard.
  - **Micro-interactions**: Hover effects, loading skeletons, and smooth transitions between pages.
- **State Management & Data Fetching**:
  - **React Query (TanStack Query)**: Handles all API interactions, providing automatic caching, revalidation, and loading states.
  - **Zustand**: Used for a lightweight authentication store, ensuring the user stays logged in across sessions.
- **Theme System**: Full implementation of Dark and Light modes using **Tailwind CSS** and **DaisyUI**, respecting system preferences or user choice.

### Backend & Database Power
The backend is a high-speed **Go (Golang)** service designed for reliability:
- **Go + Fiber**: A modern web framework that provides extremely fast routing and sub-millisecond API response times.
- **SQLite + GORM**: 
  - **Portability**: Using SQLite allows the entire database to be contained in a single file (`flashcraft.db`), making it perfect for local development and simple deployments.
  - **Relational Integrity**: GORM (Object Relational Mapper) ensures that flashcards are correctly linked to users and folders via Foreign Keys.
  - **Data Retention**: All SRS metrics (Ease Factor, Interval, Repetitions) are stored per card to ensure your learning progress is never lost.
- **Security**: 
  - **JWT Authentication**: Secure, stateless user sessions.
  - **Bcrypt**: Military-grade hashing for user passwords.
  - **Rate Limiting**: Integrated middleware to prevent brute-force attacks on API endpoints.

---

## Visual Showcase

| Home Page | Study Session |
| :---: | :---: |
| ![FlashCraft Home](./src/assets/presentitive_image.png) | ![Study Mode](./src/assets/presentative_image2.png) |

| Create Flashcards | Folder Management |
| :---: | :---: |
| ![Create Card](./src/assets/presentative_image3.png) | ![Folders](./src/assets/presentative_image4.png) |

| Interactive Deck | Dashboard View |
| :---: | :---: |
| ![Deck](./src/assets/presentative_image5.png) | ![Overview](./src/assets/presentative_image6.png) |

| Light Mode | Mobile Responsive |
| :---: | :---: |
| ![Light Mode](./src/assets/presentative_image7.png) | ![Mobile](./src/assets/presentative_image8.png) |

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
2. Create your `.env` file (if needed, though Vite often uses `.env.local`):
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
