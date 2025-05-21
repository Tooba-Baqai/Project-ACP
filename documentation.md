# Art Heaven - Project Documentation

## Project Overview

Art Heaven is a MERN stack e-commerce website for pottery and handcrafted products. The website allows users to browse, search, and purchase various handcrafted items, specifically focusing on pottery products. The application supports user authentication, order management, and an admin dashboard for inventory and order management.

## Technical Architecture

### Frontend (Client)
- **Technology Stack**: React.js with Vite, React Router, React Bootstrap, Axios
- **State Management**: Context API (AuthContext for authentication)
- **Key Features**:
  - Responsive design for mobile and desktop
  - Protected routes for authenticated users
  - Admin routes for administrative functions
  - Form validation
  - JWT-based authentication

### Backend (Server)
- **Technology Stack**: Node.js, Express.js, MongoDB (Mongoose)
- **Authentication**: JWT (JSON Web Tokens)
- **Key Features**:
  - RESTful API design
  - Protected routes middleware
  - Password hashing (bcrypt)
  - Comprehensive error handling
  - MongoDB data models and relationships

## Database Schema

### User Model
- `name`: String (required)
- `email`: String (required, unique)
- `password`: String (required, hashed)
- `role`: String (enum: 'user', 'admin', default: 'user')
- `phone`: String
- `address`: String
- `createdAt`: Date

### Product Model
- `name`: String (required)
- `description`: String (required)
- `type`: String (enum: various pottery types)
- `material`: String (enum: 'clay', 'ceramic')
- `price`: Number (required)
- `image`: String
- `inStock`: Boolean (default: true)
- `createdAt`: Date

### Order Model
- `user`: ObjectId (reference to User model)
- `product`: ObjectId (reference to Product model)
- `quantity`: Number (default: 1)
- `shippingAddress`: String (required)
- `contactNumber`: String (required)
- `status`: String (enum: 'pending', 'processing', 'shipped', 'delivered', 'cancelled')
- `orderDate`: Date

### Contact Model
- `name`: String (required)
- `email`: String (required)
- `subject`: String (required)
- `message`: String (required)
- `createdAt`: Date

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `GET /api/auth/logout` - Logout user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Orders
- `GET /api/orders` - Get all orders (User gets own orders, Admin gets all)
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order status
- `DELETE /api/orders/:id` - Delete/cancel order

### Contacts
- `GET /api/contacts` - Get all contacts (Admin only)
- `GET /api/contacts/:id` - Get single contact (Admin only)
- `POST /api/contacts` - Submit contact form
- `DELETE /api/contacts/:id` - Delete contact (Admin only)

## Security Measures

1. **Authentication**:
   - JWT-based authentication
   - Password hashing using bcrypt
   - Token expiration

2. **Authorization**:
   - Role-based access control (User/Admin)
   - Protected routes middleware
   - API endpoint protection

3. **Data Validation**:
   - Input validation on both client and server
   - MongoDB schema validation

## Future Enhancements

1. **Payment Integration**:
   - Implement Stripe/PayPal integration
   - Order confirmation emails

2. **Product Features**:
   - Product categories
   - Product reviews and ratings
   - Product image gallery

3. **User Experience**:
   - Wishlists
   - Advanced search filters
   - Pagination for product listings

4. **Admin Features**:
   - Sales analytics dashboard
   - Inventory management
   - User management

## Conclusion

Art Heaven successfully implements a complete MERN stack application with user authentication, product management, order processing, and admin functionality. The project demonstrates the effective use of modern web development technologies to create a functional e-commerce platform for artisanal pottery products. 