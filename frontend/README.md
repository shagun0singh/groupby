# GroupBy Authentication Backend

A simple and secure Node.js backend API for user authentication. This project provides user registration and login functionality with JWT (JSON Web Token) authentication.

## 📚 Table of Contents

- [What is This Project?](#what-is-this-project)
- [What Does It Do?](#what-does-it-do)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [How Authentication Works](#how-authentication-works)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)

## What is This Project?

This is a **backend API server** built with Node.js and Express. Think of it as the "brain" of an application that handles user authentication - allowing users to sign up (create accounts) and log in (access their accounts).

### Key Features:
- ✅ User registration (signup)
- ✅ User login
- ✅ Secure password storage (hashed passwords)
- ✅ JWT token-based authentication
- ✅ Role-based system (user/host roles)
- ✅ Input validation
- ✅ MongoDB database integration

## What Does It Do?

1. **User Registration**: Allows new users to create an account with first name, last name, phone number, email, and password
2. **User Login**: Allows existing users to log in with email and password
3. **Token Generation**: Creates secure JWT tokens for authenticated users
4. **Password Security**: Automatically hashes passwords before storing them in the database
5. **Data Validation**: Validates user input to ensure data quality

## Technologies Used

### Core Technologies:

1. **Node.js** - JavaScript runtime environment that allows running JavaScript on the server
2. **Express.js** - Web framework for Node.js that simplifies building APIs
3. **MongoDB** - NoSQL database to store user information
4. **Mongoose** - Library that makes it easy to work with MongoDB in Node.js

### Security & Validation:

5. **bcryptjs** - Library for hashing passwords (converts passwords into unreadable strings)
6. **jsonwebtoken (JWT)** - Creates secure tokens for user authentication
7. **express-validator** - Validates user input (checks if email is valid, password length, etc.)

### Other Tools:

8. **cors** - Allows the API to be accessed from different domains (like a React frontend)
9. **dotenv** - Manages environment variables (like database URLs and secrets)
10. **nodemon** - Automatically restarts the server when code changes (development only)

## Project Structure

Let's understand how the project is organized:

```
groupby/
│
├── backend/
│   ├── server.js               # Main entry point - starts the server
│   ├── package.json            # Backend configuration and dependencies
│   ├── nodemon.json            # Dev server config (reload on changes)
│   ├── models/                 # Database models (data structure definitions)
│   │   └── User.js             # User model - defines user data structure
│   ├── routes/                 # API routes (endpoints)
│   │   └── auth.js             # Authentication routes (signup, login)
│   ├── middleware/             # Middleware functions (run between request and response)
│   │   └── auth.js             # Authentication middleware (protects routes)
│   ├── utils/                  # Utility functions (helper functions)
│   │   └── generateToken.js    # Function to generate JWT tokens
│   └── node_modules/           # Installed dependencies (auto-generated)
│
├── frontend/ (optional)        # Placeholder for any frontend clients
├── README.md                   # You're reading it right now
└── .gitignore                  # Files/directories ignored by git
```

### Detailed File Explanations:

#### 1. `backend/server.js` - The Main Server File
- **Purpose**: This is the entry point of your application
- **What it does**:
  - Creates an Express app
  - Connects to MongoDB database
  - Sets up middleware (CORS, JSON parser)
  - Defines API routes
  - Starts the server on a port (default: 5000)
  - Handles errors

#### 2. `backend/models/User.js` - User Data Model
- **Purpose**: Defines the structure of user data in the database
- **What it contains**:
  - User schema (first name, last name, email, phone, password, role, bio, age, interests, etc.)
  - Automatic full-name generation from first/last name fields
  - Password hashing (before saving)
  - Password comparison method (for login)
  - Automatic password removal from JSON responses (security)

#### 3. `backend/routes/auth.js` - Authentication Routes
- **Purpose**: Handles authentication-related API endpoints
- **Endpoints**:
  - `POST /api/auth/signup` - Register a new user
  - `POST /api/auth/login` - Login an existing user
- **What it does**:
  - Validates user input
  - Checks if user already exists (signup)
  - Hashes passwords
  - Generates JWT tokens
  - Returns user data and token

#### 4. `backend/middleware/auth.js` - Authentication Middleware
- **Purpose**: Protects routes that require authentication
- **What it does**:
  - Checks if user has a valid JWT token
  - Verifies the token
  - Attaches user information to the request
  - Blocks unauthorized access

#### 5. `backend/utils/generateToken.js` - Token Generator
- **Purpose**: Creates JWT tokens for authenticated users
- **What it does**:
  - Takes user ID as input
  - Creates a secure token using JWT_SECRET
  - Sets token expiration (default: 7 days)

#### 6. `backend/package.json` - Project Configuration
- **Purpose**: Defines project metadata and dependencies
- **Contains**:
  - Project name, version, description
  - List of dependencies (packages needed)
  - Scripts (commands to run the project)

## Getting Started

### Prerequisites

Before you start, make sure you have installed:
- **Node.js** (version 14 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) - Package manager
- **MongoDB** - Database (you can use MongoDB Atlas for free cloud database)

### Step 1: Clone or Download the Project

If you have the project files, navigate to the project directory:

```bash
cd groupby
cd backend
```

### Step 2: Install Dependencies

Install all required packages (run this from inside the `backend` directory):

```bash
npm install
```

This reads `package.json` and installs all dependencies listed there.

### Step 3: Set Up Environment Variables

Create a `.env` file in the backend directory:

```bash
touch .env
```

Add the following variables to `.env`:

```env
# JWT Secret Key (use a random long string)
JWT_SECRET=your_super_secret_key_here_make_it_long_and_random

# MongoDB Connection String
# For local MongoDB:
MONGO_URI=mongodb://localhost:27017/groupby

# For MongoDB Atlas (cloud):
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/groupby

# Optional: JWT Token Expiration (default is 7d)
JWT_EXPIRE=7d

# Optional: Server Port (default is 5000)
PORT=5000
```

**Important**: 
- Replace `your_super_secret_key_here_make_it_long_and_random` with a random string (at least 32 characters)
- Replace MongoDB connection string with your actual database URL
- Never commit `.env` file to git (it's already in `.gitignore`)

### Step 4: Start MongoDB

**Option A: Local MongoDB**
```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Linux
sudo systemctl start mongod

# On Windows
# Start MongoDB from Services or run mongod.exe
```

**Option B: MongoDB Atlas (Cloud - Recommended for beginners)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a free cluster
4. Get your connection string
5. Add it to `.env` as `MONGO_URI`

### Step 5: Run the Server

**Development mode** (auto-restarts on code changes, run from `backend/`):
```bash
npm run dev
```

**Production mode** (also run from `backend/`):
```bash
npm start
```

You should see:
```
MongoDB connected successfully
Server is running on port 5000
```

### Step 6: Test the Server

Open your browser or use curl/Postman to test:

```bash
# Health check
curl http://localhost:5000/health
```

You should get:
```json
{
  "status": "OK",
  "message": "GroupBy API is running"
}
```

## API Endpoints

### Base URL
```
http://localhost:5000
```

### 1. Health Check

**GET** `/health`

Check if the server is running.

**Response:**
```json
{
  "status": "OK",
  "message": "GroupBy API is running"
}
```

### 2. User Registration (Signup)

**POST** `/api/auth/signup`

Register a new user.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+15551234567",
  "password": "password123",
  "confirmPassword": "password123",
  "role": "user"
}
```

**Fields:**
- `firstName` (required) - User's first name
- `lastName` (required) - User's last name
- `email` (required) - User's email address (must be valid email)
- `phone` (required) - Phone number including country code (`+` optional)
- `password` (required) - User's password (minimum 8 characters)
- `confirmPassword` (required) - Must match `password`
- `role` (optional) - User role: "user" or "host" (default: "user")

**Success Response (201):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+15551234567",
    "role": "user"
  }
}
```

**Error Response (400):**
```json
{
  "errors": [
    {
      "msg": "Please provide a valid email",
      "param": "email"
    }
  ]
}
```

**Example using curl:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+15551234567",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

### 3. User Login

**POST** `/api/auth/login`

Login an existing user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Fields:**
- `email` (required) - User's email address
- `password` (required) - User's password

**Success Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+15551234567",
    "role": "user"
  }
}
```

**Error Response (401):**
```json
{
  "message": "Invalid credentials"
}
```

**Example using curl:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

## How Authentication Works

### 1. User Registration Flow

```
1. User sends signup request with first name, last name, phone number, email, password, confirm password
   ↓
2. Server validates input (email format, password length)
   ↓
3. Server checks if email already exists
   ↓
4. Server hashes the password (converts to unreadable string)
   ↓
5. Server saves user to database
   ↓
6. Server generates JWT token
   ↓
7. Server returns token and user info to client
```

### 2. User Login Flow

```
1. User sends login request with email and password
   ↓
2. Server validates input
   ↓
3. Server finds user by email in database
   ↓
4. Server compares provided password with hashed password
   ↓
5. If passwords match, server generates JWT token
   ↓
6. Server returns token and user info to client
```

### 3. JWT Token Usage

After login/signup, the client receives a JWT token. This token should be stored (usually in localStorage or cookies) and sent with every authenticated request:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

The server verifies this token to identify the user.

### 4. Password Security

- Passwords are **never** stored in plain text
- Passwords are **hashed** using bcrypt before saving to database
- When user logs in, the provided password is hashed and compared with stored hash
- Original password cannot be recovered from hash (one-way encryption)

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `JWT_SECRET` | Secret key for signing JWT tokens | `my_super_secret_key_12345` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/groupby` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port number | `5000` |
| `JWT_EXPIRE` | JWT token expiration time | `7d` |
| `NODE_ENV` | Environment (development/production) | `development` |

### How to Generate JWT_SECRET

You can generate a random secret key using Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Or use an online generator: [randomkeygen.com](https://randomkeygen.com/)

## Deployment

### Deploying to Render

1. **Push your code to GitHub**

2. **Create a new Web Service on Render**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

3. **Configure the service**
   - **Name**: groupby-backend (or any name)
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

4. **Add Environment Variables**
   - Go to "Environment" tab
   - Add `JWT_SECRET` (generate a random string)
   - Add `MONGO_URI` (your MongoDB connection string)
   - Add `PORT` (Render will set this automatically, but you can set it)

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Your API will be available at `https://your-app-name.onrender.com`

### Deploying to Heroku

1. **Install Heroku CLI**: [heroku.com/cli](https://devcenter.heroku.com/articles/heroku-cli)

2. **Login to Heroku**:
   ```bash
   heroku login
   ```