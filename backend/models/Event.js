const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  coordinates: { type: [Number], default: null } // [longitude, latitude]
}, { _id: false });

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Workshop', 'Meetup', 'Class', 'Social', 'Sports', 'Arts', 'Tech', 'Food', 'Other']
  },
  category: {
    type: String,
    required: true,
    // Examples: Photography, Cooking, Gaming, Fitness, Book Club, etc.
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  image: {
    type: String,
    default: null
  },
  hostedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    type: locationSchema,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    default: null // e.g., "2 hours", "Half day"
  },
  maxParticipants: {
    type: Number,
    required: true,
    min: 2,
    max: 100
  },
  currentParticipants: {
    type: Number,
    default: 0
  },
  requiresApproval: {
    type: Boolean,
    default: true
  },
  interests: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  price: {
    type: Number,
    default: 0,
    min: 0
  },
  priceType: {
    type: String,
    enum: ['Free', 'Paid', 'Donation'],
    default: 'Free'
  },
  visibility: {
    type: String,
    enum: ['public', 'private', 'invite-only'],
    default: 'public'
  },
  status: {
    type: String,
    enum: ['open', 'full', 'cancelled', 'completed'],
    default: 'open'
  },
  requirements: {
    type: String,
    default: null // What participants need to bring/know
  },
  ageRestriction: {
    minAge: { type: Number, default: null },
    maxAge: { type: Number, default: null }
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }]
}, {
  timestamps: true
});

// Indexes for efficient queries
eventSchema.index({ slug: 1 }, { unique: true });
eventSchema.index({ hostedBy: 1 });
eventSchema.index({ date: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ interests: 1 });
eventSchema.index({ 'location.city': 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ createdAt: -1 });

// Auto-update status based on participants
eventSchema.pre('save', function(next) {
  if (this.currentParticipants >= this.maxParticipants) {
    this.status = 'full';
  } else if (this.status === 'full' && this.currentParticipants < this.maxParticipants) {
    this.status = 'open';
  }
  next();
});

module.exports = mongoose.model('Event', eventSchema);

