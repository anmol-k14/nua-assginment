# User Management System - Setup Guide

A full-stack application to manage users with Vue.js + Vuetify frontend and Node.js + Express + MySQL backend.

---

## 📦 Prerequisites

- Node.js (v14+)
- MySQL (v5.7+)
- npm

---

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in backend folder:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=user_management
DB_PORT=3306
PORT=3000
```

Start backend:
```bash
npm start
```

### 3. Frontend Setup

```bash
cd frontend
cd vite-project
npm install
npm run dev
```
