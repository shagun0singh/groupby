# GoFest Project - Complete Analysis

## 📋 Project Overview

**GoFest** is a full-stack college fest management platform built as a monorepo with:
- **Backend**: Node.js/Express REST API (MongoDB)
- **Frontend**: Next.js 14 (TypeScript/React)

### Purpose
A platform where:
- **Users** can discover and register for college fests
- **Hosts** can create and manage their college fests
- Features include event listings, registration management, location services, and user authentication

---

## 🏗️ Project Structure

```
groupby/
├── backend/                    # Node.js/Express API
│   ├── config/
│   │   └── database.js        # MongoDB connection config
│   ├── middleware/
│   │   └── auth.js            # JWT authentication middleware
│   ├── models/
│   │   ├── User.js            # User schema (firstName, lastName, email, phone, password, role)
│   │   ├── Fest.js            # Fest/Event schema (title, location, organizer, events array)
│   │   └── Registration.js    # Registration schema (user, fest, status, payment)
│   ├── routes/
│   │   ├── auth.js            # POST /signup, POST /login
│   │   ├── fests.js           # CRUD operations for fests
│   │   ├── registrations.js   # User registrations management
│   │   └── location.js        # Reverse geocoding API
│   ├── utils/
│   │   ├── generateToken.js   # JWT token generation
│   │   └── jwt.js             # Alternative JWT utilities
│   ├── server.js              # Main Express server
│   └── package.json
│
├── frontend/                  # Next.js application
│   ├── app/                   # Next.js App Router
│   │   ├── page.tsx           # Homepage with image grid
│   │   ├── login/
│   │   │   └── page.tsx       # Login/Signup page
│   │   ├── events/
│   │   │   ├── page.tsx       # Events listing with map
│   │   │   └── [slug]/
│   │   │       └── page.tsx   # Individual fest detail page
│   │   └── host/
│   │       └── page.tsx       # Host fest creation/management
│   ├── components/
│   │   ├── ui/                # Reusable UI components
│   │   └── hooks/             # Custom React hooks
│   ├── lib/
│   │   └── api.ts             # API client functions
│   ├── src/
│   │   ├── services/
│   │   │   ├── apiClient.js   # HTTP client wrapper
│   │   │   └── authService.js # Auth-specific API calls
│   │   └── components/
│   │       └── AuthLayout.jsx
│   └── package.json
│
└── README.md                   # Project documentation
```

---

## 🔍 Key Findings & Issues

### ✅ What's Working

1. **Authentication System**
   - User signup with firstName, lastName, email, phone, password
   - User login with email/password
   - JWT token generation and validation
   - Password hashing with bcryptjs

2. **Database Models**
   - Well-structured Mongoose schemas
   - Proper relationships (User → Fest → Registration)
   - Indexes for performance

3. **Frontend Pages**
   - Homepage with image grid
   - Events listing with search and map
   - Fest detail pages
   - Host fest creation form

### ⚠️ Critical Issues

#### 1. **Backend Routes Not Registered** 🔴
**Problem**: `server.js` only registers `/api/auth` route, but frontend expects:
- `/api/fests` - Not registered
- `/api/registrations` - Not registered  
- `/api/location` - Not registered

**Impact**: Frontend cannot fetch fests, create fests, or use location services.

**Fix Needed**: Add route registrations in `server.js`:
```javascript
app.use('/api/auth', require('./routes/auth'));
app.use('/api/fests', require('./routes/fests'));
app.use('/api/registrations', require('./routes/registrations'));
app.use('/api/location', require('./routes/location'));
```

#### 2. **Module Export Mismatch** 🔴
**Problem**: `routes/fests.js` uses ES6 `export default router` but server uses CommonJS `require()`.

**Impact**: Route import will fail.

**Fix Needed**: Change `fests.js` to use CommonJS:
```javascript
module.exports = router;  // Instead of export default router
```

#### 3. **JWT Secret Inconsistency** 🟡
**Problem**: Multiple files check different env var names:
- `middleware/auth.js` checks `SECRET_KEY`
- `utils/generateToken.js` checks `JWT_SECRET` or `SECRET_KEY`
- `utils/jwt.js` checks `SECRET_KEY`

**Impact**: Token verification might fail if wrong env var is set.

**Fix Needed**: Standardize on `JWT_SECRET` everywhere.

#### 4. **Duplicate JWT Utilities** 🟡
**Problem**: Two JWT utility files with different implementations:
- `utils/generateToken.js` - Used by auth routes
- `utils/jwt.js` - Not used anywhere

**Impact**: Code confusion, potential bugs.

**Fix Needed**: Remove unused `jwt.js` or consolidate.

#### 5. **Frontend API Base URL** 🟡
**Problem**: Frontend uses different env var names:
- `lib/api.ts` uses `NEXT_PUBLIC_API_URL`
- `src/services/apiClient.js` uses `VITE_API_URL` or `REACT_APP_API_URL`

**Impact**: API calls might fail if wrong env var is set.

**Fix Needed**: Standardize on `NEXT_PUBLIC_API_URL` for Next.js.

#### 6. **Auth Middleware Function Name** 🟡
**Problem**: Routes use `authenticate` but middleware exports `{ authenticate }`.

**Impact**: Should work, but inconsistent naming.

---

## 📊 Database Schema

### User Model
```javascript
{
  firstName: String (required, min 2 chars)
  lastName: String (required, min 2 chars)
  name: String (auto-generated from firstName + lastName)
  email: String (required, unique, lowercase)
  phone: String (required, unique, 10-15 digits)
  password: String (required, min 8 chars, hashed)
  role: String (enum: 'user' | 'host', default: 'user')
  bio: String (optional, max 500 chars)
  age: Number (optional, min 13, max 120)
  interests: [String]
  profilePic: String
  location: {
    city: String
    state: String
    country: String
  }
  timestamps: true
}
```

### Fest Model
```javascript
{
  title: String (required)
  slug: String (required, unique, lowercase)
  category: String (required)
  description: String (required)
  image: String (required)
  tagline: String
  college: String (required)
  date: String (required)
  duration: String
  location: {
    city: String (required)
    state: String (required)
    address: String
    coordinates: [Number] // [lng, lat]
  }
  organizer: {
    name: String (required)
    role: String (required)
    college: String (required)
    email: String
    phone: String
    instagram: String
    linkedin: String
  }
  entryType: String (default: "Free")
  entryFee: Number (default: 0)
  expectedFootfall: String
  website: String
  brochure: String
  events: [{
    name: String
    date: String
    time: String
    venue: String
    category: String
    prize: String
    limit: String
  }]
  hostedBy: ObjectId (ref: User, required)
  registrationsCount: Number (default: 0)
  status: String (enum: 'draft' | 'published' | 'cancelled' | 'completed', default: 'published')
  timestamps: true
}
```

### Registration Model
```javascript
{
  user: ObjectId (ref: User, required)
  fest: ObjectId (ref: Fest, required)
  registeredEvents: [String]
  status: String (enum: 'registered' | 'attended' | 'cancelled', default: 'registered')
  paymentStatus: String (enum: 'pending' | 'paid' | 'refunded' | 'not_required', default: 'not_required')
  paymentAmount: Number (default: 0)
  registrationDate: Date (default: Date.now)
  timestamps: true
}
// Indexes: { user: 1, fest: 1 } (unique), { fest: 1 }, { user: 1 }
```

---

## 🔌 API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/signup` - Register new user
  - Body: `{ firstName, lastName, email, phone, password, confirmPassword, role? }`
  - Returns: `{ message, token, user }`
  
- `POST /api/auth/login` - Login user
  - Body: `{ email, password }`
  - Returns: `{ message, token, user }`

### Fests (`/api/fests`) - **NOT REGISTERED** ⚠️
- `GET /api/fests` - List fests (with pagination, category, search)
- `GET /api/fests/:slug` - Get fest by slug
- `POST /api/fests` - Create fest (requires auth)
- `PUT /api/fests/:id` - Update fest
- `DELETE /api/fests/:id` - Delete fest (requires auth, host only)
- `GET /api/fests/user/my-fests` - Get user's hosted fests (requires auth)
- `POST /api/fests/:id/register` - Register for fest (requires auth)
- `GET /api/fests/:id/registrations` - Get fest registrations (requires auth, host only)

### Registrations (`/api/registrations`) - **NOT REGISTERED** ⚠️
- `GET /api/registrations/my-registrations` - Get user's registrations (requires auth)
- `GET /api/registrations/:id` - Get registration by ID (requires auth)
- `PATCH /api/registrations/:id/cancel` - Cancel registration (requires auth)

### Location (`/api/location`) - **NOT REGISTERED** ⚠️
- `GET /api/location/reverse-geocode?lat=&lon=` - Reverse geocode coordinates (requires auth, rate limited)
- `GET /api/location/search?query=` - Search locations (requires auth, rate limited)

---

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **File Upload**: cloudinary (configured but not used in routes)
- **Other**: cors, dotenv

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript + JavaScript
- **Styling**: Tailwind CSS
- **Icons**: lucide-react
- **Maps**: Leaflet (via events-map component)
- **Fonts**: Google Fonts (Geist, Caveat Brush, Audiowide)

---

## 🔐 Environment Variables

### Backend (`.env` in `backend/`)
```env
# Required
JWT_SECRET=your_secret_key_here
MONGO_URI=mongodb://localhost:27017/groupby
# or
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/groupby

# Optional
PORT=5000
JWT_EXPIRE=7d
NODE_ENV=development
```

### Frontend (`.env.local` in `frontend/`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
# or for production
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

---

## 🚀 Deployment Status

### Current Issues Blocking Deployment

1. **Next.js Config**: ✅ Fixed (converted `next.config.ts` → `next.config.js`)
2. **Missing Dependencies**: ✅ Fixed (added `lucide-react`)
3. **Backend Routes**: ❌ **NOT FIXED** - Routes not registered in server.js
4. **Module Exports**: ❌ **NOT FIXED** - `fests.js` uses ES6 export

### Vercel Deployment
- Frontend is configured for Vercel
- Backend should be deployed separately (Render, Railway, etc.)
- Environment variables need to be set in Vercel dashboard

---

## 📝 Recommended Fixes

### Priority 1: Critical (Blocks Functionality)

1. **Register missing routes in `server.js`**:
```javascript
app.use('/api/auth', require('./routes/auth'));
app.use('/api/fests', require('./routes/fests'));
app.use('/api/registrations', require('./routes/registrations'));
app.use('/api/location', require('./routes/location'));
```

2. **Fix `fests.js` export**:
```javascript
// Change from:
export default router;
// To:
module.exports = router;
```

### Priority 2: Important (Code Quality)

3. **Standardize JWT_SECRET**:
   - Update `middleware/auth.js` to use `JWT_SECRET` instead of `SECRET_KEY`
   - Remove `utils/jwt.js` or consolidate with `generateToken.js`

4. **Standardize API URL env var**:
   - Remove `VITE_API_URL` and `REACT_APP_API_URL` checks
   - Use only `NEXT_PUBLIC_API_URL` in frontend

### Priority 3: Nice to Have

5. **Add error handling** for missing routes
6. **Add request logging** middleware
7. **Add API documentation** (Swagger/OpenAPI)
8. **Add unit tests** for critical routes

---

## 🎯 Next Steps

1. ✅ Fix Next.js config (DONE)
2. ✅ Add missing dependencies (DONE)
3. ❌ Register backend routes (TODO)
4. ❌ Fix module exports (TODO)
5. ❌ Standardize environment variables (TODO)
6. ❌ Test all API endpoints (TODO)
7. ❌ Deploy backend to production (TODO)
8. ❌ Update frontend API URL for production (TODO)

---

## 📚 Additional Notes

- The project uses a **monorepo structure** but could benefit from a shared types package
- **Cloudinary** is configured but not actively used in routes (image uploads might be handled client-side)
- **Google Auth** is mentioned in dependencies but not implemented
- The frontend has both **TypeScript** (`app/`) and **JavaScript** (`src/`) code - consider migrating to TypeScript
- **Location services** use OpenStreetMap Nominatim API (free, but rate-limited)

---

**Last Updated**: Based on current codebase analysis
**Status**: ⚠️ Partially functional - authentication works, but fest/registration features are blocked by missing route registrations

