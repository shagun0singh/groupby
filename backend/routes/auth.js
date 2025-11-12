const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

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

module.exports = router;

