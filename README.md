# FrameIt 📸

FrameIt is a full‑stack photo‑sharing web app where users can upload, explore, and interact with posts in a clean, modern interface. Think **Instagram‑lite**, but built from scratch to deeply understand real‑world auth, APIs, and frontend architecture.

---

## ✨ Features

- 🔐 **Authentication** (Register / Login / Logout)
- 🧠 **Remember Me** support
- 🖼️ **Create & View Posts**
- ❤️ **Like & Comment on Posts**
- 🔍 **Search Users & Posts**
- 👤 **User Profiles**
- 🛡️ **Protected Routes**

---

## 🛠️ Tech Stack

### Frontend

- React
- React Router
- Axios
- Context API
- Tailwind CSS

### Backend

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication

### Deployment

- Frontend: Render
- Backend: Render

---

## 🔑 Authentication Model

- Uses **JWT‑based authentication**
- Tokens are stored client‑side

  - `sessionStorage` → normal login
  - `localStorage` → when **Remember Me** is enabled

- Single‑token approach for simplicity and reliability

---

## Live URL

https://frameit-frontend.onrender.com/

## 🚀 Getting Started (Local Setup)

### 1. Clone the repo

```bash
git clone https://github.com/your-username/frameit.git
cd frameit
```

### 2. Setup Backend

```bash
cd backend
npm install
npm run dev
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongo_uri
JWT_SECRET=your_secret
```

### 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 📂 Project Structure (Simplified)

```txt
frameit/
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   └── models/
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── context/
│   └── services/
```

---

## 🧪 Why This Project Exists

FrameIt was built to:

- Understand **real authentication flows**
- Handle **CORS, deployment, and API design**
- Practice **clean frontend architecture**
- Learn how things break in production (and fix them 👀)

---

## 📌 Future Improvements

- Image optimization
- Pagination / infinite scroll
- Better error handling
- Notifications

---

## 🧠 Author

Built by **Black** — learning by building, breaking, and rebuilding.

---

## ⭐️ If you like it

Drop a star ⭐ and feel free to fork or contribute!
