const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled', 'attended'],
    default: 'pending'
  },
  applicationMessage: {
    type: String,
    maxlength: 500,
    default: null
  },
  appliedAt: {
    type: Date,
    default: Date.now
  },
  respondedAt: {
    type: Date,
    default: null
  },
  hostResponse: {
    type: String,
    maxlength: 500,
    default: null
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },
  review: {
    type: String,
    maxlength: 500,
    default: null
  }
}, {
  timestamps: true
});

// Compound index to ensure one user can only apply once per event
participantSchema.index({ user: 1, event: 1 }, { unique: true });
participantSchema.index({ event: 1, status: 1 });
participantSchema.index({ user: 1, status: 1 });
participantSchema.index({ createdAt: -1 });

// Update event participant count when status changes
participantSchema.post('save', async function() {
  const Event = mongoose.model('Event');
  const event = await Event.findById(this.event);
  
  if (event) {
    const approvedCount = await mongoose.model('Participant').countDocuments({
      event: this.event,
      status: 'approved'
    });
    
    event.currentParticipants = approvedCount;
    await event.save();
  }
});

// Also update count when participant is removed
participantSchema.post('remove', async function() {
  const Event = mongoose.model('Event');
  const event = await Event.findById(this.event);
  
  if (event) {
    const approvedCount = await mongoose.model('Participant').countDocuments({
      event: this.event,
      status: 'approved'
    });
    
    event.currentParticipants = approvedCount;
    await event.save();
  }
});

module.exports = mongoose.model('Participant', participantSchema);

