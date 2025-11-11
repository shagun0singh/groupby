# GroupBy Backend API

A comprehensive Node.js backend API for **GroupBy** - A Curated Event & Gathering Platform that enables users to host and join selective, interest-based local events with an approval system.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Database Models](#database-models)
- [Authentication Flow](#authentication-flow)
- [How It Works](#how-it-works)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

GroupBy is designed to bridge the gap between large-scale event platforms and small community gatherings. Unlike platforms like BookMyShow that focus on ticketed events, GroupBy allows individuals and small communities to:

- **Host selective events** with approval-based participation
- **Discover curated events** based on interests, age, and location
- **Build meaningful connections** through interest-based gatherings
- **Ensure safety** through host-controlled participant approval

### Problem Statement

Existing event discovery apps mainly focus on large-scale, ticketed events. They don't provide a simple way for individuals or small communities to host their own gatherings (workshops, meetups, local interest-based events). GroupBy solves this by providing:

- Easy event creation for hosts
- Selective participant approval system
- AI-powered event recommendations
- Privacy controls (only approved participants see full details)

## ✨ Features

### Core Features

1. **Authentication & Authorization**
   - JWT-based authentication
   - Role-based access control (User/Host)
   - Secure password hashing with bcrypt

2. **User Management**
   - User profiles with bio, age, interests, location
   - Profile picture support
   - Profile updates

3. **Event Management**
   - Create, read, update, delete events
   - Event categories and tags
   - Location-based events
   - Age and gender filters
   - Event banners

4. **Application System**
   - Users apply to join events
   - Hosts approve/reject applications
   - Application messages

5. **Smart Recommendations**
   - AI-powered event recommendations
   - Based on interests, age, location
   - Falls back to rule-based if AI unavailable

6. **Search & Discovery**
   - Full-text search (title, description, tags)
   - Filter by category, location, date, age
   - Sort by date, popularity, creation time
   - Pagination support

7. **Privacy & Security**
   - Only approved participants see full event details
   - Host-only event management
   - JWT token-based authentication
   - Input validation and sanitization

## 🏗️ System Architecture

```
┌─────────────┐
│   Client    │ (React Frontend)
│  (Frontend) │
└──────┬──────┘
       │ HTTP/REST API
       │
┌──────▼─────────────────────────────────┐
│         Express.js Server              │
│  ┌──────────────────────────────────┐ │
│  │   Authentication Middleware      │ │
│  │   (JWT Verification)             │ │
│  └──────────────────────────────────┘ │
│  ┌──────────────────────────────────┐ │
│  │   Route Handlers                 │ │
│  │   - /api/auth                    │ │
│  │   - /api/users                   │ │
│  │   - /api/events                  │ │
│  │   - /api/recommendations         │ │
│  └──────────────────────────────────┘ │
│  ┌──────────────────────────────────┐ │
│  │   Business Logic                │ │
│  │   - Recommendation Service       │ │
│  │   - Validation                  │ │
│  └──────────────────────────────────┘ │
└──────┬─────────────────────────────────┘
       │
       │ Mongoose ODM
       │
┌──────▼─────────────────────────────────┐
│         MongoDB Database               │
│  ┌──────────┐  ┌──────────┐          │
│  │  Users   │  │  Events  │          │
│  └──────────┘  └──────────┘          │
│  ┌──────────┐                        │
│  │Applications│                      │
│  └──────────┘                        │
└────────────────────────────────────────┘
```

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **Validation:** express-validator
- **CORS:** cors middleware

### Optional AI Integration
- **OpenAI API:** For enhanced recommendations
- **Google Gemini API:** Alternative AI recommendation engine

### Development Tools
- **nodemon:** Auto-reload during development
- **dotenv:** Environment variable management

## 📁 Project Structure

```
groupby/
├── models/                    # Database models
│   ├── User.js                # User schema (authentication, profile)
│   ├── Event.js               # Event schema (host, details, filters)
│   └── Application.js         # Application schema (user → event)
│
├── routes/                     # API route handlers
│   ├── auth.js                # Authentication routes (signup, login)
│   ├── users.js               # User profile routes (GET, PUT)
│   ├── events.js              # Event routes (CRUD, applications)
│   └── recommendations.js     # AI recommendations route
│
├── middleware/                 # Custom middleware
│   └── auth.js                # JWT authentication & authorization
│
├── services/                   # Business logic
│   └── recommendationService.js  # Recommendation algorithms
│
├── utils/                      # Utility functions
│   └── generateToken.js       # JWT token generation
│
├── server.js                   # Main server file
├── package.json                # Dependencies & scripts
├── nodemon.json                # Nodemon configuration
├── .env                        # Environment variables (not in git)
├── env.example                 # Environment variables template
├── test-api.sh                 # Automated API tests
├── test-auth.sh                # Authentication tests
├── check-setup.js              # Setup validation script
└── README.md                   # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd groupby
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
# Copy the example file
cp env.example .env

# Edit .env with your configuration
```

4. **Configure environment variables:**

Create a `.env` file with the following:

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb://localhost:27017/groupby
# Or for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/groupby?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
JWT_EXPIRE=7d

# Optional: AI API Keys (for enhanced recommendations)
OPENAI_API_KEY=your-openai-api-key-optional
GEMINI_API_KEY=your-gemini-api-key-optional
```

5. **Start MongoDB:**
```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas (cloud) - no local setup needed
```

6. **Verify setup:**
```bash
npm run check
```

7. **Start the server:**
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5001` (or your configured PORT).

## 📚 API Documentation

### Base URL
```
http://localhost:5001/api
```

### Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Endpoints Overview

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST | `/api/auth/signup` | Register new user | No | - |
| POST | `/api/auth/login` | Authenticate user | No | - |
| GET | `/api/users/:id` | Get user profile | Yes | Any |
| PUT | `/api/users/:id` | Update user profile | Yes | Owner |
| GET | `/api/events` | List events (with filters) | Yes | Any |
| POST | `/api/events` | Create event | Yes | Host |
| GET | `/api/events/:id` | Get event details | Yes | Any |
| PUT | `/api/events/:id` | Update event | Yes | Host (Owner) |
| DELETE | `/api/events/:id` | Delete event | Yes | Host (Owner) |
| POST | `/api/events/:id/apply` | Apply to event | Yes | User |
| GET | `/api/events/:id/applications` | Get applications | Yes | Host (Owner) |
| PUT | `/api/events/:id/applications` | Approve/reject application | Yes | Host (Owner) |
| GET | `/api/recommendations` | Get recommendations | Yes | Any |

### Detailed Endpoint Documentation

#### 1. Authentication

**POST `/api/auth/signup`**
- Register a new user
- Returns JWT token and user info
- Request body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"  // optional: "user" or "host"
}
```

**POST `/api/auth/login`**
- Authenticate existing user
- Returns JWT token and user info
- Request body:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### 2. Users

**GET `/api/users/:id`**
- Get user profile by ID
- Returns user data (without password)

**PUT `/api/users/:id`**
- Update own profile
- Can update: name, email, bio, age, interests, profilePic, location

#### 3. Events

**GET `/api/events`**
- List all published events with pagination
- Query parameters:
  - `search`: Search in title, description, tags
  - `category`: Filter by category
  - `city`, `country`: Filter by location
  - `dateFrom`, `dateTo`: Filter by date range
  - `minAge`, `maxAge`: Filter by age range
  - `sortBy`: `date`, `popularity`, `created`
  - `sortOrder`: `asc`, `desc`
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)

**POST `/api/events`**
- Create new event (Host only)
- Request body includes: title, description, category, tags, date, time, location, maxParticipants, filters

**GET `/api/events/:id`**
- Get event details
- Limited details for non-approved users
- Full details for approved participants or host

**PUT `/api/events/:id`**
- Update event (Host, Owner only)

**DELETE `/api/events/:id`**
- Delete event (Host, Owner only)

#### 4. Applications

**POST `/api/events/:id/apply`**
- Apply to join an event
- Optional message field

**GET `/api/events/:id/applications`**
- Get all applications for an event (Host, Owner only)

**PUT `/api/events/:id/applications`**
- Approve or reject application
- Request body:
```json
{
  "applicationId": "application-id",
  "status": "approved"  // or "rejected"
}
```

#### 5. Recommendations

**GET `/api/recommendations`**
- Get AI-powered event recommendations
- Query parameter: `limit` (default: 10)
- Based on user interests, age, location, past applications

## 🗄️ Database Models

### User Model

```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: 'user', 'host', default: 'user'),
  bio: String (max 500 chars),
  age: Number (13-120),
  interests: [String],
  profilePic: String (URL),
  location: {
    city: String,
    state: String,
    country: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

**Features:**
- Password automatically hashed before saving
- Password excluded from JSON responses
- Email validation and uniqueness

### Event Model

```javascript
{
  host: ObjectId (ref: User, required),
  title: String (required, max 200 chars),
  description: String (required, max 2000 chars),
  category: String (required),
  tags: [String],
  date: Date (required),
  time: String (required),
  location: {
    address: String (required),
    city: String (required),
    state: String,
    country: String (required),
    coordinates: { lat: Number, lng: Number }
  },
  maxParticipants: Number (required, min: 1),
  banner: String (URL),
  filters: {
    minAge: Number (min: 13),
    maxAge: Number (max: 120),
    gender: String (enum: 'all', 'male', 'female', 'other')
  },
  status: String (enum: 'draft', 'published', 'cancelled', 'completed', default: 'published'),
  approvedParticipants: [ObjectId] (ref: User),
  applications: [ObjectId] (ref: Application),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- Text index on title, description, tags, category (for search)
- Index on date (for sorting)
- Index on location.city (for filtering)
- Index on status (for filtering)

### Application Model

```javascript
{
  event: ObjectId (ref: Event, required),
  applicant: ObjectId (ref: User, required),
  status: String (enum: 'pending', 'approved', 'rejected', default: 'pending'),
  message: String (max 500 chars),
  appliedAt: Date (default: now),
  createdAt: Date,
  updatedAt: Date
}
```

**Constraints:**
- Unique index on (event, applicant) - one application per user per event

## 🔐 Authentication Flow

### Signup Flow

```
1. Client sends: { name, email, password, role }
   ↓
2. Server validates input (express-validator)
   ↓
3. Check if email already exists
   ↓
4. Hash password (bcrypt)
   ↓
5. Create user in database
   ↓
6. Generate JWT token
   ↓
7. Return: { token, user: { id, name, email, role } }
```

### Login Flow

```
1. Client sends: { email, password }
   ↓
2. Server validates input
   ↓
3. Find user by email
   ↓
4. Compare password with hashed password (bcrypt)
   ↓
5. Generate JWT token
   ↓
6. Return: { token, user: { id, name, email, role } }
```

### Protected Route Flow

```
1. Client sends request with: Authorization: Bearer <token>
   ↓
2. Middleware extracts token from header
   ↓
3. Verify JWT token (jsonwebtoken)
   ↓
4. Extract user ID from token
   ↓
5. Fetch user from database
   ↓
6. Attach user to request (req.user)
   ↓
7. Route handler processes request
   ↓
8. Return response
```

### Role-Based Access Control

- **User Role:** Can view events, apply to events, update own profile
- **Host Role:** All user permissions + create/edit/delete own events, manage applications

## 🔄 How It Works

### Event Creation & Application Flow

```
1. Host creates event
   POST /api/events
   → Event saved with status: 'published'
   → Host automatically added to approvedParticipants

2. User discovers event
   GET /api/events (with search/filters)
   → Sees limited event details

3. User applies to event
   POST /api/events/:id/apply
   → Application created with status: 'pending'
   → Application added to event.applications array

4. Host reviews applications
   GET /api/events/:id/applications
   → Sees all pending applications with user details

5. Host approves/rejects
   PUT /api/events/:id/applications
   → Application status updated
   → If approved: User added to event.approvedParticipants
   → User can now see full event details
```

### Recommendation System

The recommendation system uses a multi-layered approach:

1. **Rule-Based Scoring:**
   - Interest matching (tags, category)
   - Location matching (city, country)
   - Age compatibility
   - Event recency (closer events score higher)
   - Popularity (participant count)

2. **AI Enhancement (Optional):**
   - If OpenAI or Gemini API keys are provided
   - Sends user profile + candidate events to AI
   - AI ranks events by relevance
   - Falls back to rule-based if AI unavailable

3. **Exclusion:**
   - Excludes events user already applied to
   - Excludes events user is already approved for
   - Only shows future events

### Privacy Model

- **Public Information:** Event title, category, date, location (city), max participants
- **Limited Details:** Description, tags, filters (shown to all authenticated users)
- **Full Details:** Approved participants list, application count (only for approved participants or host)
- **Host-Only:** Application details, applicant information

## 🧪 Testing

### Automated Tests

**Test all APIs:**
```bash
./test-api.sh
```

**Test authentication only:**
```bash
./test-auth.sh
```

**Check setup:**
```bash
npm run check
```

### Manual Testing with curl

See `curl-examples.md` for detailed curl commands.

**Quick test:**
```bash
# Health check
curl http://localhost:5001/health

# Signup
curl -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"pass123","role":"user"}'

# Login
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"pass123"}'
```

## 🚀 Deployment

### Environment Setup

1. **Set production environment variables:**
```env
NODE_ENV=production
PORT=5001
MONGO_URI=your-production-mongodb-uri
JWT_SECRET=strong-random-secret-min-32-chars
```

2. **Install dependencies:**
```bash
npm install --production
```

3. **Start server:**
```bash
npm start
```

### Deployment Platforms

**Backend:**
- **Render:** Connect GitHub repo, set environment variables
- **Railway:** Similar to Render
- **Heroku:** Use Procfile: `web: node server.js`
- **DigitalOcean App Platform:** Connect repo, configure

**Database:**
- **MongoDB Atlas:** Recommended for production
- **MongoDB on Render/Railway:** Managed MongoDB

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5001
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/groupby?retryWrites=true&w=majority
JWT_SECRET=generate-strong-random-secret-here-min-32-characters
JWT_EXPIRE=7d
```

## 🐛 Troubleshooting

### Common Issues

**1. MongoDB Connection Error**
```
Error: MongoDB connection error
```
**Solution:**
- Check MongoDB is running (local) or accessible (Atlas)
- Verify MONGO_URI in .env
- For Atlas: Check IP whitelist and credentials
- Test connection: `mongosh "your-connection-string"`

**2. Port Already in Use**
```
Error: listen EADDRINUSE: address already in use :::5001
```
**Solution:**
- Change PORT in .env
- Or kill process: `lsof -ti:5001 | xargs kill -9`

**3. JWT_SECRET Missing**
```
Error: Missing required environment variables: JWT_SECRET
```
**Solution:**
- Add JWT_SECRET to .env file
- Generate strong secret: `openssl rand -base64 32`

**4. Authentication Fails**
```
Error: Not authorized, token failed
```
**Solution:**
- Check JWT_SECRET matches between signup/login
- Verify token is sent in Authorization header
- Check token hasn't expired

**5. Host Role Required Error**
```
Error: Access denied. Host role required.
```
**Solution:**
- User must signup with `"role": "host"`
- Or update user role in database

### Debug Mode

Enable detailed error messages:
```env
NODE_ENV=development
```

## 📝 API Response Formats

### Success Response
```json
{
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "message": "Error message",
  "errors": [
    {
      "type": "field",
      "msg": "Validation error",
      "path": "email",
      "location": "body"
    }
  ]
}
```

### Pagination Response
```json
{
  "events": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalEvents": 50,
    "limit": 10
  }
}
```

## 🔒 Security Features

1. **Password Security:**
   - Passwords hashed with bcrypt (12 rounds)
   - Never returned in API responses

2. **JWT Security:**
   - Tokens expire after 7 days (configurable)
   - Secret key required (min 32 characters recommended)
   - Token verification on every protected route

3. **Input Validation:**
   - All inputs validated with express-validator
   - Email format validation
   - Password length requirements
   - SQL injection prevention (MongoDB)

4. **Authorization:**
   - Role-based access control
   - Resource ownership verification
   - Host-only endpoints protected

5. **CORS:**
   - Configured for cross-origin requests
   - Adjust in server.js for production

## 📊 Database Relationships

```
User (1) ──< (Many) Event (host)
User (1) ──< (Many) Application (applicant)
Event (1) ──< (Many) Application (event)
Event (Many) ──< (Many) User (approvedParticipants)
```

## 🎯 Future Enhancements

- [ ] Email notifications for applications
- [ ] Event reminders
- [ ] User reviews and ratings
- [ ] Event chat/messaging
- [ ] Payment integration
- [ ] Image upload to cloud storage
- [ ] Advanced analytics
- [ ] Mobile app API support

## 📄 License

ISC

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📧 Support

For issues and questions:
- Check the troubleshooting section
- Review API documentation
- Check server logs for errors

---

**Built with ❤️ for community-driven events**
