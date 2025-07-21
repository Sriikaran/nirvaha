# 📦 Nirvaha

**Nirvaha** is a full-stack business management platform developed as part of an internship project. It streamlines and automates key business operations such as product management, user handling, and order processing through a modern, scalable web interface.

---

## 🚀 Features

- 📋 **Product Management**  
  Add, edit, and delete products with image support and category tagging.

- 👥 **User Role Control**  
  Admin and user authentication system with permission-based access.

- 🛒 **Order Tracking System**  
  Maintain order statuses and generate reports.

- 🔐 **Secure Login System**  
  JWT-based authentication and protected routes.

- 🖼️ **Admin Dashboard**  
  Centralized control panel to manage all core entities.

---

## 📂 Folder Structure

nirvaha/
├── client/               # React frontend  
│   ├── components/       # Reusable UI components  
│   └── pages/            # React Router pages  
├── server/               # Node.js backend (Express)  
│   ├── models/           # Mongoose data models  
│   ├── routes/           # API routes  
│   └── controllers/      # Logic for each endpoint  
├── .env                  # Environment variables  
└── README.md             # Project documentation

---

## 🛠️ Tech Stack

- **Frontend:** React, Tailwind CSS  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB (Mongoose)  
- **Auth:** JWT (JSON Web Tokens)  
- **Hosting:** Render / Vercel / Railway (based on deployment)

---

## 🧑‍💻 Getting Started (Local Setup)

1. **Clone the repository**  

   ```bash
   git clone https://github.com/Sriikaran/nirvaha.git
   cd nirvaha

   
2. Install dependencies for both client and server

   cd client
   npm install
   cd ../server
   npm install


3. Set up environment variables
   Create a .env file inside the /server folder with necessary MongoDB URI and JWT secret:

   MONGO_URI=your_mongo_db_uri
   JWT_SECRET=your_jwt_secret


4. Start the development servers

   Backend (from /server):
      npm start

   Frontend (in a separate terminal from /client):
      npm start


5. Open http://localhost:3000 for frontend
   Open http://localhost:5000/api for backend API




