# DevConnect 🚀

DevConnect is a full-stack social networking and portfolio platform designed exclusively for developers. It allows developers to showcase their projects, connect with peers, chat in real-time, and discover exciting portfolios and talent through a robust global search.

## ✨ Features

* **User Authentication:** Secure JWT-based registration, login, and robust session management.
* **Developer Profiles:** Customizable profiles with avatars, biographies, and specialized tech-stacks.
* **Project Showcase:** Add projects complete with descriptions, images (hosted on Cloudinary), GitHub repository links, and live deployment URLs.
* **Global Search functionality:** Seamlessly search for developers by their name or tech stack, and search for projects using keywords.
* **Social Connections:** Follow and unfollow other developers to build your network.
* **Real-time Chatting:** Engage with your network instantly via WebSockets (Socket.io).
* **Live Notifications:** Receive instant in-app alerts on interactions, new messages, and platform activity.
* **Dark / Light Mode & Responsive Design:** Sleek, modern aesthetics created with Tailwind CSS ensuring excellent cross-device capability.

## 🛠 Tech Stack

### Frontend
- [React (Vite)](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router DOM](https://reactrouter.com/)
- Zustand (State Management)
- Axios (API Client)

### Backend
- [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) & Mongoose (Database & ODM)
- Cloudinary (Image & Media storage)
- JSON Web Tokens (Authentication)
- Socket.io (Real-time features)
- bcryptjs (Password hashing)

## 🏎️ Running Locally

Follow these steps to run DevConnect on your local machine:

### 1. Clone the repository
```bash
git clone https://github.com/arpit315/TeamUP.git
cd TeamUP
```

### 2. Configure Environment Variables
You will need `.env` files for both the frontend and backend. 

**Backend (`backend/.env`):**
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
CORS_ORIGIN=http://localhost:5173
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

**Frontend (`frontend/.env`):**
```env
VITE_API_URL=http://localhost:5000/api/v1
```

### 3. Install Dependencies & Start the Servers

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

The frontend should now be running at `http://localhost:5173` and connected to the backend API at `http://localhost:5000`.

## 🤝 Contributing
Contributions, issues and feature requests are welcome. Feel free to check issues page if you want to contribute!

## 📜 License
This project is open-source and free to be used and modified under the MIT License.
