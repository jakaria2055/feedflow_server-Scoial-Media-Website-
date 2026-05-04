# FeedFlow Server 

Backend API server for the **FeedFlow Social Media Platform** — a modern full-stack social media application built with **Node.js, Express, MongoDB, Socket.IO, and Cloudinary**.

This backend handles authentication, posts, reels, stories, messaging, notifications, media uploads, and real-time communication.

---

## 🌐 Live API

🔗 Production Server:  
https://feedflow-server-scoial-media-website.onrender.com

---

# 📌 Features

- 🔐 JWT Authentication & Authorization
- 🍪 Secure Cookie-Based Login System
- 👤 User Profile Management
- 🖼️ Image & Video Upload with Cloudinary
- 📝 Create / Update / Delete Posts
- 🎬 Reels System
- 📖 Stories Feature
- ❤️ Like & Comment System
- 👥 Follow / Unfollow Users
- 💬 Real-Time Messaging using Socket.IO
- 🟢 Online User Tracking
- 🔔 Notification System
- ☁️ Cloudinary Media Storage
- 🌍 RESTful API Architecture
- ⚡ Optimized Middleware Structure
- 🧩 Modular MVC Pattern

---

# 🛠️ Tech Stack

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

## Authentication
- JWT (jsonwebtoken)
- Cookie Parser
- bcryptjs

## Media Upload
- Multer
- Cloudinary
- multer-storage-cloudinary

## Real-Time Features
- Socket.IO

## Utilities
- dotenv
- cors
- body-parser
- nodemon

---

# 📂 Project Structure

```bash
feedflow_server
│
├── config
│   ├── cloudinary.js
│   └── connectDB.js
│
├── controllers
│   ├── messageControllers.js
│   ├── postControllers.js
│   ├── reelControllers.js
│   ├── stroyControllers.js
│   └── userControllers.js
│
├── middleware
│   ├── authMiddleware.js
│   └── cloudinaryUpload.js
│
├── models
│   ├── message.model.js
│   ├── post.model.js
│   ├── reel.model.js
│   ├── story.model.js
│   └── user.model.js
│
├── routes
│   ├── messageRouter.js
│   ├── postRouter.js
│   ├── reelRouter.js
│   ├── storyRoutes.js
│   └── userRouter.js
│
├── seeds
│   └── seed.js
│
├── socket
│   └── socket.js
│
├── index.js
├── package.json
└── package-lock.json
```

---

# ⚙️ Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone <repository-url>
cd feedflow_server
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 3️⃣ Create `.env` File

Create a `.env` file in the root directory.

```env
PORT=3000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

NODE_ENV=development
```

---

## 4️⃣ Run Development Server

```bash
npm run dev
```

---

## 5️⃣ Start Production Server

```bash
npm start
```

---

# 🔌 API Base URL

```bash
http://localhost:3000/api/v1
```

Production:

```bash
https://feedflow-server-scoial-media-website.onrender.com/api/v1
```

---

# 📡 API Routes

## 👤 User Routes

```bash
/api/v1/user
```

Features:
- Register User
- Login User
- Logout User
- Update Profile
- Follow / Unfollow
- Get Suggested Users
- Search Users

---

## 📝 Post Routes

```bash
/api/v1/post
```

Features:
- Create Post
- Delete Post
- Like / Unlike Post
- Comment on Post
- Get Feed Posts
- Get Single Post

---

## 🎬 Reel Routes

```bash
/api/v1/reel
```

Features:
- Upload Reels
- Like Reels
- Comment Reels
- Delete Reels

---

## 📖 Story Routes

```bash
/api/v1/story
```

Features:
- Upload Story
- View Stories
- Delete Story

---

## 💬 Message Routes

```bash
/api/v1/messages
```

Features:
- Send Messages
- Get Conversations
- Real-Time Chat

---

# ⚡ Real-Time Socket.IO Features

The project includes a complete real-time communication system using Socket.IO.

## Features

- Real-Time Messaging
- Live Online User Tracking
- Instant User Status Updates
- Socket-Based Event Handling

---

## Socket Connection

```js
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://feedflow-app-social-media-website.vercel.app",
    ],
    credentials: true,
  },
});
```

---

## Online Users Management

```js
onlineUsersMap[userId] = socket.id;
```

Connected users are tracked dynamically and broadcasted to all clients.

---

# 🔐 Authentication System

FeedFlow uses secure JWT authentication with HTTP-only cookies.

## Security Features

- Password Hashing using bcryptjs
- JWT Token Authentication
- HTTP-Only Cookies
- Protected Routes Middleware
- Authorization Validation

---

# ☁️ Cloudinary Media Upload

All images and videos are uploaded and managed through Cloudinary.

Supported Upload Types:
- Images
- Videos
- Reels Media
- Stories Media
- Profile Photos

---

# 📦 Available Scripts

## Run Development Server

```bash
npm run dev
```

## Run Production Server

```bash
npm start
```

## Seed Database

```bash
npm run seed
```

---

# 🌍 CORS Configuration

```js
const corsInstance = {
  origin: [
    "http://localhost:5173",
    "https://feedflow-app-social-media-website.vercel.app"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};
```

---

# 🧠 Architecture

The backend follows a clean and scalable architecture pattern:

- MVC Structure
- Modular Routing
- Reusable Middleware
- Separation of Concerns
- RESTful API Design
- Real-Time Socket Layer

---

# 🚀 Deployment

Backend deployed on:

- Render

Frontend deployed on:

- Vercel

---

# 📈 Future Improvements

- Group Chat System
- Push Notifications
- Video Calling
- AI-Based Feed Recommendation
- Story Reactions
- Saved Collections
- Admin Dashboard
- Post Analytics

---

# 👨‍💻 Developer

Developed by **Jakaria Ahmed**

Passionate Full Stack Developer focused on building modern, scalable, and real-world web applications.

---

# 📜 License

This project is licensed under the ISC License.

---

# ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub.
It helps support the project and motivates further development.

---
