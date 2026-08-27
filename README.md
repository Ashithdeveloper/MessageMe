# 💬 MessageMe (Bubbly)

> A modern, real-time cross-platform chat and messaging application built with **React Native (Expo)**, **Node.js (Express)**, **Socket.IO**, and **MongoDB**.

---

[![React Native](https://img.shields.io/badge/React_Native-0.81-61DAFB?logo=react&logoColor=black)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-v54-000020?logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express_5-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Socket.io](https://img.shields.io/badge/Socket.io-Real--Time-010101?logo=socket.io&logoColor=white)](https://socket.io/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_9-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)

---

## 📱 App Screenshots

### 1. Onboarding & Authentication
| Welcome / Splash | Sign Up | Login |
| :---: | :---: | :---: |
| <img src="./screenshot/Screenshot%202026-08-27%20192749.png" width="240" alt="Welcome Screen" /> | <img src="./screenshot/Screenshot%202026-08-27%20192805.png" width="240" alt="Sign Up Screen" /> | <img src="./screenshot/Screenshot%202026-08-27%20192814.png" width="240" alt="Login Screen" /> |

### 2. Chats & Real-Time Messaging
| Direct Messages | 1-on-1 Chat Screen | Group Messages |
| :---: | :---: | :---: |
| <img src="./screenshot/Screenshot%202026-08-27%20193235.png" width="240" alt="Direct Messages Home" /> | <img src="./screenshot/Screenshot%202026-08-27%20193245.png" width="240" alt="Conversation Screen" /> | <img src="./screenshot/Screenshot%202026-08-27%20194630.png" width="240" alt="Group Messages Home" /> |

### 3. User Discovery, Groups & Profile
| Select User | Create New Group | User Profile & Settings |
| :---: | :---: | :---: |
| <img src="./screenshot/Screenshot%202026-08-27%20193259.png" width="240" alt="Select User Modal" /> | <img src="./screenshot/Screenshot%202026-08-27%20194640.png" width="240" alt="New Group Screen" /> | <img src="./screenshot/Screenshot%202026-08-27%20194650.png" width="240" alt="Profile Screen" /> |

---

## ✨ Features

- ⚡ **Real-Time Messaging**: Instant bidirectional communication powered by Socket.IO.
- 👥 **Direct & Group Chats**: Switch effortlessly between 1-on-1 conversations and multi-user group rooms.
- 🔍 **User Discovery**: Browse and start conversations with registered users on the platform.
- 🔒 **Secure Authentication**: JWT-based authentication with bcrypt password encryption.
- 🖼️ **Profile Customization**: Update profile details and upload custom user avatars.
- 🎨 **Modern & Responsive UI**: Clean aesthetic with dark doodle wallpaper, customized message bubbles, and smooth screen transitions.

---

## 🛠️ Tech Stack

### Mobile Frontend
- **Framework**: React Native with [Expo](https://expo.dev/) (SDK 54) & Expo Router
- **Language**: TypeScript
- **State & Storage**: React Hooks, AsyncStorage
- **Networking & Real-Time**: Axios, Socket.io-client
- **Icons & UI**: Phosphor Icons, Expo Vector Icons, React Native Reanimated

### Backend Server
- **Runtime**: Node.js with [Express 5](https://expressjs.com/)
- **Language**: TypeScript (`tsx` for dev execution)
- **Database**: MongoDB with [Mongoose 9](https://mongoosejs.com/)
- **Real-Time Engine**: Socket.io 4
- **Security**: JSON Web Tokens (JWT), bcryptjs, CORS

---

## 📁 Project Structure

```text
MessageMe/
├── backend/                  # Express & Socket.io Backend Server
│   ├── middleware/           # JWT Auth Verification Middleware
│   ├── Socket/               # Socket.io connection & event handlers
│   │   ├── chatEvents.ts     # Real-time chat & message broadcasting
│   │   ├── socket.ts         # Socket initialization
│   │   └── userEvens.ts      # User connection & status events
│   └── src/
│       ├── Controllers/      # Authentication & Profile Controllers
│       ├── DB/               # MongoDB connection setup
│       ├── Routes/           # Express REST API routes
│       ├── model/            # Mongoose Schemas (User, Message, Group)
│       └── server.ts         # Server entry point
│
├── mobile/                   # React Native (Expo) Mobile Application
│   ├── app/                  # Expo Router navigation routes
│   │   ├── (auth)/           # Authentication screens (Welcome, Login, Register)
│   │   └── (main)/           # Main screens (Home, Conversation, Profile, Groups)
│   ├── assets/               # Images, fonts, and icons
│   ├── components/           # Reusable UI components
│   ├── config/               # API & backend endpoint configuration
│   └── services/             # API services & image upload handlers
│
└── screenshot/               # App preview screenshots
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas connection string)
- [Expo Go](https://expo.dev/go) app installed on your physical device or an Android/iOS emulator

---

### 1. Backend Setup

1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend` directory:
   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/messageme
   JWT_SECRET=your_super_secret_jwt_key
   ```

4. Start the backend development server:
   ```bash
   npm run dev
   ```
   The backend server will run at `http://localhost:3000`.

---

### 2. Mobile Setup

1. Open a new terminal and navigate to the `mobile` directory:
   ```bash
   cd mobile
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update the backend API URL in [mobile/config/api.ts](file:///d:/WorkSpace/MessageMe/mobile/config/api.ts):
   ```typescript
   // Replace with your local machine's IP address (e.g. 192.168.x.x) if running on physical device
   export const API_BASE_URL = "http://<YOUR_LOCAL_IP>:3000";
   ```

4. Start the Expo development server:
   ```bash
   npx expo start --clear
   ```

5. Scan the QR code using the **Expo Go** app on Android/iOS, or press `a` for Android Emulator / `i` for iOS Simulator.

---

## 📡 REST API Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Register a new user account | ❌ |
| `POST` | `/api/auth/login` | Log in and receive JWT token | ❌ |
| `GET` | `/api/auth/profile` | Fetch authenticated user profile | ✅ |
| `PUT` | `/api/auth/profile/edit` | Update user profile & avatar | ✅ |

---

## 🔌 Socket.IO Events

| Event Name | Direction | Payload / Description |
| :--- | :--- | :--- |
| `join` | Client ➔ Server | Join room with user/chat ID |
| `sendMessage` | Client ➔ Server | Send message payload (sender, receiver, message) |
| `receiveMessage` | Server ➔ Client | Broadcast incoming message to active conversation |
| `createGroup` | Client ➔ Server | Initialize group room with selected member IDs |

---

## 📄 License

This project is open-source and available under the [ISC License](file:///d:/WorkSpace/MessageMe/backend/package.json).
