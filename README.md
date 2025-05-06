# Art Heaven - MERN Stack E-Commerce Website

Art Heaven is a MERN Stack (MongoDB, Express.js, React, Node.js) e-commerce website for pottery and handcrafted products.

## Project Structure

The project is divided into two main folders:

- **client** - Frontend built with React (Vite)
- **server** - Backend built with Express.js, MongoDB, and Node.js

## Features

- User authentication (register, login, profile management) using JWT
- Protected routes for authenticated users and admin
- Product browsing, filtering, and searching
- Order placement and management
- Admin panel for product, order, and customer management
- Contact form submission
- Responsive design

## Technologies Used

### Backend:
- Node.js
- Express.js
- MongoDB & Mongoose
- JWT for authentication
- bcrypt for password hashing

### Frontend:
- React (with Vite)
- React Router for navigation
- React Bootstrap for UI components
- Axios for API requests
- JWT for authentication
- React Icons

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- MongoDB (local or Atlas)

### Installation and Setup

1. Clone the repository:
```
git clone https://github.com/your-username/art-heaven.git
cd art-heaven
```

2. Install dependencies:
```
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Create a `.env` file in the server directory:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
```

4. Start the development servers:
```
# Start the server (from the server directory)
npm run dev

# Start the client (from the client directory)
npm run dev
```

5. Access the application:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

## GitHub Repository Link

[https://github.com/your-username/art-heaven](https://github.com/your-username/art-heaven)

## Authors

- Author 1 - [Your Name](https://github.com/your-github-username)
- Author 2 - [Your Partner's Name](https://github.com/partner-github-username)

## License

This project is licensed under the MIT License. 