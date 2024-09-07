# Ecommerce-Application

## Overview

Welcome to the **Ecommerce-Application** project by Harish Kunwar. This backend application is designed using **Node.js**, **Express**, and **Mongoose**, providing a robust foundation for building a fully functional e-commerce platform. It includes features for managing products, users, orders, and more, ensuring an efficient shopping experience.

---

## Key Features

- **Product Management**: Complete functionality to manage products, including adding, updating, and deleting.
- **User Authentication & Authorization**: Secure login and signup using **JWT (JSON Web Tokens)**, with token-based authentication for protected routes.
- **Order Management**: Efficient handling of customer orders with status tracking and order history.
- **Cart Functionality**: Users can add products to their cart, update quantities, and manage items before checkout.
- **Image Upload**: Supports image upload via **Cloudinary** for secure product image management.
- **Security Enhancements**: Integrated rate limiting, **Helmet** security headers, and request validation.
- **Express Framework**: Utilizes the Express framework for routing and middleware.
- **Mongoose ORM**: Provides easy data modeling and querying.

---

## Getting Started

### Prerequisites

Ensure you have the following installed on your machine:

- **Node.js** (v14.x or higher)
- **MongoDB** (local or cloud-based)
- **Cloudinary** account (for image uploads)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Hariskunwar/E-commerce-Application

2. Navigate to the project directory and install dependencies:
   
   npm install

3. Set up environment variables:

   PORT=
   MONGO_URI=
   JWT_SECRET=
   JWT_EXPIRE=
   EMAIL_HOST=
   EMAIL_PORT=
   EMAIL_USER=
   EMAIL_PASSWORD=
   CLOUD_NAME=
   API_KEY=
   API_SECRET=

###Usage  

To start the server, run:

  npm run dev 

  

    