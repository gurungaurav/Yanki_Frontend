# Yanki - Professional Barber Equipment E-Commerce

An e-commerce platform specializing in professional barber equipment (clippers, trimmers, shavers).

## Features

### User Features
- **User Authentication**: Register/login with JWT
- **Product Browsing**: Filter/sort products by category, price, ratings
- **Shopping Cart**: Add/remove items, quantity adjustment using zustand
- **Checkout**: Khalti payment gateway integration
- **Order History**: Track past purchases
- **Product Reviews**: CRUD operations for user reviews

### Admin Features
- **Dashboard**: Sales analytics
- **Product Management**: CRUD products
- **Order Management**: Process/update order status

## Tech Stack

**Frontend:**
- React.js (Vite)
- Zustand (State management)
- Tailwind CSS
- Shadcn-ui
- Formik + Yup (Form validation)
- Axios (HTTP client)
- React Router v6

**Backend:**
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (Authentication)
- Bcrypt (Password hashing)
- Multer (File uploads)
- Nodemailer (Email notifications)

**Payment Integration:**
- Khalti Payment Gateway

## Installation

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas URI or local MongoDB
- Khalti API keys
