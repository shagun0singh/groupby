const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.post(
  '/signup',
  [
    body('firstName')
      .trim()
      .notEmpty()
      .withMessage('First name is required')
      .isLength({ min: 2 })
      .withMessage('First name must be at least 2 characters'),
    body('lastName')
      .trim()
      .notEmpty()
      .withMessage('Last name is required')
      .isLength({ min: 2 })
      .withMessage('Last name must be at least 2 characters'),
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email')
      .normalizeEmail(),
    body('phone')
      .trim()
      .notEmpty()
      .withMessage('Phone number is required')
      .matches(/^[0-9()+\-\s]{10,20}$/)
      .withMessage('Please provide a valid phone number'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters'),
    body('confirmPassword')
      .custom((value, { req }) => value === req.body.password)
      .withMessage('Passwords do not match'),
    body('role')
      .optional()
      .isIn(['user', 'host'])
      .withMessage('Role must be either user or host')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { firstName, lastName, email, phone, password, role } = req.body;
      const normalizedEmail = email.toLowerCase();
      const digitsOnly = phone.replace(/[^0-9]/g, '');

      if (digitsOnly.length < 10 || digitsOnly.length > 15) {
        return res.status(400).json({
          message: 'Phone number must contain between 10 and 15 digits',
          errors: [{ param: 'phone', msg: 'Phone number must contain between 10 and 15 digits' }]
        });
      }

      const normalizedPhone = `+${digitsOnly}`;

      const existingUserByEmail = await User.findOne({ email: normalizedEmail });
      if (existingUserByEmail) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      const existingUserByPhone = await User.findOne({ phone: normalizedPhone });
      if (existingUserByPhone) {
        return res.status(400).json({ message: 'User already exists with this phone number' });
      }

      const user = await User.create({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: normalizedEmail,
        phone: normalizedPhone,
        password,
        role: role || 'user'
      });

      const token = generateToken(user._id);

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;
      const normalizedEmail = email.toLowerCase();

      const user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = generateToken(user._id);

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      name: user.name,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      bio: user.bio,
      age: user.age,
      interests: user.interests,
      profilePic: user.profilePic,
      location: user.location,
      role: user.role,
      hostProfile: user.hostProfile,
      stats: user.stats
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Google OAuth Login/Signup
router.post('/google', async (req, res) => {
  try {
    const { access_token } = req.body;

    if (!access_token) {
      return res.status(400).json({ message: 'Access token is required' });
    }

    // Fetch user info from Google using the access token
    const userInfoResponse = await fetch(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
    );

    if (!userInfoResponse.ok) {
      return res.status(401).json({ message: 'Invalid Google access token' });
    }

    const googleUser = await userInfoResponse.json();

    // Check if user exists in database
    let user = await User.findOne({ email: googleUser.email.toLowerCase() });
    let isNewUser = false;

    if (!user) {
      // Create new user if doesn't exist
      user = await User.create({
        firstName: googleUser.given_name || googleUser.name?.split(' ')[0] || 'User',
        lastName: googleUser.family_name || googleUser.name?.split(' ').slice(1).join(' ') || '',
        email: googleUser.email.toLowerCase(),
        phone: '', // Will be collected in profile completion
        password: Math.random().toString(36).slice(-16), // Random password (user won't use it)
        role: 'user',
        profilePic: googleUser.picture || '',
        googleId: googleUser.sub, // Store Google ID for future reference
      });
      
      isNewUser = true;
      console.log('✅ New user created via Google OAuth:', user.email);
    } else {
      console.log('✅ Existing user logged in via Google OAuth:', user.email);
    }

    // Generate JWT token
    const token = generateToken(user._id);

    res.json({
      message: 'Google authentication successful',
      token,
      isNewUser,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profilePic: user.profilePic,
        location: user.location,
      }
    });
  } catch (error) {
    console.error('❌ Google OAuth error:', error);
    res.status(500).json({ message: 'Server error during Google authentication', error: error.message });
  }
});

// Complete Profile (for Google OAuth users)
router.post('/complete-profile', authenticate, async (req, res) => {
  try {
    const { phone, location } = req.body;

    console.log('📝 Complete profile request:', { phone, location });

    if (!phone || phone.trim() === '') {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    if (!location?.city || location.city.trim() === '') {
      return res.status(400).json({ message: 'City is required' });
    }

    // Validate phone number format
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(phone.trim())) {
      return res.status(400).json({ message: 'Please provide a valid phone number (10-15 digits)' });
    }

    // Check if phone number is already taken by another user
    const existingUser = await User.findOne({ 
      phone: phone.trim(), 
      _id: { $ne: req.user._id } 
    });
    
    if (existingUser) {
      return res.status(400).json({ message: 'Phone number is already registered' });
    }

    // Update user profile
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        phone: phone.trim(),
        location: {
          city: location.city.trim(),
          state: location.state?.trim() || '',
          country: location.country?.trim() || ''
        }
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('✅ Profile completed for user:', user.email);

    res.json({
      message: 'Profile completed successfully',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        location: user.location,
        role: user.role
      }
    });
  } catch (error) {
    console.error('❌ Complete profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

