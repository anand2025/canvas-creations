# 🎨 Canvas & Creations

## Overview

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
- **Global AI Assistant**: An interactive AI helper available across the platform to guide users and enhance the shopping experience.

### 🛠️ Admin & Seller Features
- Product management (add, update, delete)
- Inventory management
- Order management
- Scalable API structure
- **AI-Powered Product Descriptions**: Automatically generate compelling and engaging product descriptions with a single click using AI.
- **Dynamic Media Handling**: Environment-aware dynamic URL generation for media and image uploads.

---

## 🧰 Tech Stack

### Backend
- **FastAPI**
- **MongoDB**
- **Motor (Async MongoDB driver)**
- **Python**
- **Google Gemini API** (for AI integrations)
- RESTful API design

### Frontend
- **Next.js**
- **React.js**
- **Tailwind CSS**

---

## 🐳 How to Run with Docker

The easiest way to run the entire stack (Frontend and Backend) is using Docker Compose.

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) installed and running.

### Steps
1. Clone the repository and navigate to the project root.
2. Ensure you have your environment variables set up:
   - Add `.env` in the `back-end` directory with your database configurations and `GEMINI_API_KEY`.
   - Add `.env.local` in the `frontend` directory with your `NEXT_PUBLIC_API_URL` if necessary.
3. Build and start the containers:
   ```bash
   docker compose up --build
   ```
4. Access the applications:
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:8000
   - **Swagger API Docs**: http://localhost:8000/docs

---

## ⚙️ How to Run the Project Locally (Without Docker)

### 🔹 Backend Setup

```bash
cd back-end
python -m venv venv
venv\Scripts\activate  # On Windows. Use `source venv/bin/activate` on Mac/Linux.
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

📍 **Open:**
- API: http://localhost:8000
- Swagger Docs: http://localhost:8000/docs

### 🔹 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

📍 **Open:**
- Frontend: http://localhost:3000