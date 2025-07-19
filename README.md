# 📧 Multi-Tenant AI-Powered Email Platform

A secure, full-stack server-side web application built using the MVCS (Model-View-Controller-Service) architecture. It allows admins to manage users in isolated databases, and lets users generate and send AI-powered emails in real-time.

---

## 🔑 Key Features

- 🔐 **Admin & User Authentication**
  - Admins can register, log in, and manage users.
  - Each user is assigned to their admin’s dedicated database.
  - Secure login using JWT and cookies.

- 🏢 **Multi-Tenant Architecture**
  - Each admin gets a separate MongoDB database named after their email.
  - Ensures strong data isolation, security, and scalability.

- 🤖 **AI-Powered Email Generation**
  - Users can create smart email messages using Gemini 2.5 Flash API.
  - Generated content appears in real-time using Socket.IO.
  - Emails match the formatting of user-typed input.

- ✉️ **File Attachments & Email Tracking**
  - Users can attach files and send emails via SMTP.
  - View the subject and body of the last sent email.

- 🔁 **OTP-Based Password Reset**
  - Both users and admins can reset their passwords securely using OTP verification.

- 📡 **Real-Time Streaming with Socket.IO**
  - Live stream Gemini-generated content directly to the email input box.

---

## 🏗 Architecture

This project follows the **MVCS architecture**:
- **Model** – Handles MongoDB schema definitions and data structures.
- **View** – Frontend interface built using HTML, CSS, and JavaScript.
- **Controller** – Routes and request handlers for admin/user/email functionality.
- **Service** – Business logic and integrations (Gemini API, SMTP, etc.).

---

## 🧰 Tech Stack

### Backend
- **Node.js** + **Express.js** – REST APIs & app logic
- **MongoDB** – NoSQL database with dynamic multi-tenant setup
- **Socket.IO** – Real-time data streaming
- **Gemini 2.5 Flash API** – Smart content generation
- **Nodemailer (SMTP)** – Email sending with attachments

### Frontend
- **HTML**, **CSS**, **JavaScript** – Clean UI with live updates
- Displays generated email content as users type or stream from API

---

## 📁 Folder Structure
project-root/
│
├── config/ # Database connections and global config
├── controllers/ # Route logic (admin, user, email, auth)
├── middlewares/ # JWT auth, role-based access, error handling
├── models/ # Mongoose schemas for User, Admin, EmailLog, etc.
├── routes/ # Express route definitions for APIs
├── services/ # Business logic (Gemini API, SMTP email sending, OTP)
├── utils/ # Helper functions, token handlers, validations
├── views/ # Frontend (HTML, JS, CSS for user interface)
│
├── .gitignore
├── package.json
├── package-lock.json
└── server.js # Main server entry point


This structure reflects the **MVCS** design:
- **Model** → `models/`
- **View** → `views/`
- **Controller** → `controllers/` + `routes/`
- **Service** → `services/`

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js, MongoDB, Socket.IO, Nodemailer
- **Frontend:** Vanilla JS, HTML, CSS (served from `views/`)
- **AI Engine:** Gemini 2.5 Flash API for email content
- **Email:** SMTP + file attachments
- **Security:** JWT Auth, OTP for password reset, cookie sessions

---

## 🚀 How to Run Locally

### 1. Clone the Repo

git clone https://github.com/Bharat8327/multi-tenant-email-app.git
cd multi-tenant-email-app

Install Server Dependencies
npm install

###  Create .env in Root

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_email_password

node server.js

### Access App
Visit: http://localhost:5000

Admin and user interfaces are served from the views/ directory.

### 🌐 Live Demo
https://mutlitent-43ds.com

### 📌 Summary
This project is designed to simulate a real-world SaaS platform:

Built using MVCS for clean scalability

Supports multi-database tenants for data isolation

Real-time AI email generation + streaming

Full email delivery system with attachments and logs

