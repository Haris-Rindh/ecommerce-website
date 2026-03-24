🌍 GlobalTrade - B2B E-Commerce Platform

📁 Project Structure

ecommerce-platform/
│
├── public/
│   └── index.html
├── src/
│   ├── assets/            # Images, icons, global CSS
│   ├── components/        # Reusable UI (Header, Footer, ProductCards, Home sections)
│   ├── context/           # Global State Management (Cart, Wishlist, User, Toast)
│   ├── pages/             # Route Components
│   │   ├── Admin/         # Admin Dashboard, Bulk Import
│   │   ├── Auth/          # Login, Register
│   │   ├── Product/       # Details, Reviews, Related Items, Description Tabs
│   │   ├── Profile/       # User Orders, Saved Items, Messages
│   │   ├── Cart.jsx
│   │   ├── CategoryPage.jsx
│   │   ├── Checkout.jsx
│   │   └── SearchPage.jsx
│   ├── App.jsx            # Main App component & Routing setup
│   ├── firebase.js        # Firebase configuration & initialization
│   └── main.jsx           # React entry point
│
├── .env                   # Environment variables (Firebase Keys)
├── tailwind.config.js     # Tailwind CSS styling rules
└── package.json


🌐 Live Deployment

Environment

Link

Status

🔥 Local Development

http://localhost:5173

✅ Ready

🚀 Production Deploy

(Coming Soon)

⏳ Pending

💡 Note: For live public access, deploy to Vercel or Firebase Hosting. Follow the deployment guide below!

📖 Overview

GlobalTrade is a complete, serverless MERN-alternative e-commerce application designed for scaling B2B & B2C global inventory. Built with modern React practices, Tailwind CSS for stunning responsiveness, and Firebase for a robust, real-time backend.

Feature

Description

Architecture

Serverless Stack (React.js, Firebase Auth, Firestore DB)

Authentication

Secure Email/Password login capturing complete user profiles

State Management

React Context API for Cart, Wishlist, and Toast notifications

Styling

Tailwind CSS + Mobile-First Responsive Design

Product Catalog

Advanced sidebar filtering (Brands, Category, Price Slider, Rating)

B2B Capabilities

Tiered bulk pricing, verified supplier badges, bulk JSON importing

Admin Dashboard

Real-time order tracking, inventory management, and data uploads

🎯 Features

👤 Customer Experience

Feature

Details

🔐 Authentication

Secure Login and Registration capturing Name and Phone Number.

🛍️ Advanced Browsing

Grid/List view toggles, dual-range price sliders, and multi-select filters.

⭐ Interactive Reviews

Real-time star ratings and customer comment system on product pages.

🛒 Dynamic Cart

Add/Remove items, dynamic total calculations with automated tax and discounts.

💖 Wishlist

"Save for later" functionality to bookmark products across sessions.

📱 Responsive UI

Mobile-first design with off-canvas filter drawers and swipeable product rows.

⚙️ Technical & Admin Capabilities

Capability

Implementation

Database

Firebase Firestore NoSQL database for real-time syncing without a custom backend server.

Bulk Import Tool

Custom JSON parser in the Admin panel to upload massive product catalogs instantly.

Order Management

Admin dashboard to view customer details and update shipping status (Processing → Delivered).

Routing & Security

React Router DOM with protected routes preventing unauthorized checkout/admin access.

🛠️ Tech Stack

┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND                                │
│  React 18 • React Router DOM • Tailwind CSS • Lucide Icons  │
├─────────────────────────────────────────────────────────────┤
│                     BACKEND & DATABASE                      │
│  Firebase Firestore (NoSQL) • Serverless Architecture       │
├─────────────────────────────────────────────────────────────┤
│                     AUTHENTICATION                          │
│  Firebase Auth • Protected Routes • Session Persistence     │
├─────────────────────────────────────────────────────────────┤
│                     STATE MANAGEMENT                        │
│  Context API (GlobalState, ToastContext)                    │
└─────────────────────────────────────────────────────────────┘


📦 Quick Start Guide

Prerequisites

✓ Node.js v18+ installed
✓ Firebase account with a configured Web App
✓ Git version control

Step 1: Clone Repository

git clone [https://github.com/YourUsername/GlobalTrade-Ecommerce.git](https://github.com/YourUsername/GlobalTrade-Ecommerce.git)
cd GlobalTrade-Ecommerce


Step 2: Install Dependencies

npm install


Step 3: Configure Environment Variables

Create a .env file in the root directory and add your Firebase configuration keys:

VITE_FIREBASE_API_KEY="your_api_key_here"
VITE_FIREBASE_AUTH_DOMAIN="your_project_id.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your_project_id"
VITE_FIREBASE_STORAGE_BUCKET="your_project_id.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="1234567890"
VITE_FIREBASE_APP_ID="1:1234567890:web:abc123def456"


Step 4: Run Application

npm run dev


Step 5: Access Application

Frontend Client: http://localhost:5173 (or port provided by Vite)

Admin Dashboard: Register an account using your designated Admin Email to unlock the /admin route. (Change the ADMIN_EMAIL constant in Header.jsx and App.jsx to match your email).

🧪 Testing Checklist

[x] User Registration & Authentication Flow

[x] Responsive Mobile Navigation & Hamburger Menu

[x] Product Browsing & Off-Canvas Mobile Filtering

[x] Add to Cart & Dynamic Math Engine (Tax/Discounts)

[x] Wishlist "Save for later" Functionality

[x] Live Product Reviews Submission

[x] Checkout Process & Order Creation in Firestore

[x] Admin Dashboard Access & Order Status Updating

[x] Admin Bulk JSON Product Import

🚀 Future Roadmap

[ ] Stripe Payment Gateway Integration

[ ] Automated Order Confirmation Emails

[ ] User Profile Avatar Uploads via Firebase Storage

[ ] Multi-Language Support Translation Toggle

[ ] Dark Mode UI Theme

Open a Pull Request to contribute!
👨‍💻 Developed By Haris Rindh