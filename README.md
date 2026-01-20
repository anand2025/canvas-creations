# 🎨 Canvas & Creations

## 🌟 Overview

**Canvas & Creations** is a full-stack e-commerce platform designed to sell **small paintings, handmade crafts, gift items, and paper crafts**.  
The project focuses on building a **scalable, secure, and user-friendly online store** with a smooth shopping experience across devices.

Customers can explore products through categories, search and filters, add items to cart, and place orders seamlessly. An intuitive admin dashboard helps manage products and orders efficiently.

This project demonstrates **real-world backend and full-stack engineering practices**, including API design, database modeling, and modular architecture.

---

## 🚀 Key Features

### 👩‍💻 User Features
- Browse products by category
- Search and filter products
- Shopping cart functionality
- Secure checkout flow
- Order tracking
- Responsive design (mobile & desktop)

### 🛠️ Admin Features
- Product management (add, update, delete)
- Inventory management
- Order management
- Scalable API structure

---

## 🧰 Tech Stack

### Backend
- **FastAPI**
- **MongoDB**
- **Motor (Async MongoDB driver)**
- **Python**
- RESTful API design

### Frontend
- **Next.js**
- **React.js**
- **Tailwind CSS**

---

## ⚙️ How to Run the Project Locally

🔹 Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn main:app --reload

Open:

API: http://localhost:8000

Swagger Docs: http://localhost:8000/docs

🔹 Frontend Setup
cd frontend
npm install
npm run dev


📍 Open:

http://localhost:3000