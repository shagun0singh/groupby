const express = require('express');
const Participant = require('../models/Participant');
const Event = require('../models/Event');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.post("/apply", authenticate, async (req, res, next) => {
  try {
    const { eventId, applicationMessage } = req.body;
    
    const event = await Event.findById(eventId);
    
    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }
    
    if (event.status !== 'open') {
      return res.status(400).json({
        message: "This event is not accepting applications"
      });
    }
    
    if (event.hostedBy.toString() === req.user._id.toString()) {
      return res.status(400).json({
        message: "You cannot apply to your own event"
      });
    }
    
    const existingApplication = await Participant.findOne({
      user: req.user._id,
      event: eventId
    });
    
    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied to this event"
      });
    }
    
    const participant = new Participant({
      user: req.user._id,
      event: eventId,
      status: event.requiresApproval ? 'pending' : 'approved',
      applicationMessage
    });
    
    await participant.save();
    
    const populatedParticipant = await Participant.findById(participant._id)
      .populate('event', 'title date location hostedBy')
      .populate('user', 'name email profilePic');
    
    res.status(201).json(populatedParticipant);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "You have already applied to this event"
      });
    }
    next(error);
  }
});

router.get("/my-applications", authenticate, async (req, res, next) => {
  try {
    const applications = await Participant.find({ user: req.user._id })
      .populate('event', 'title date location image type category hostedBy maxParticipants currentParticipants')
      .sort({ appliedAt: -1 });
    
    res.json(applications);
  } catch (error) {
    next(error);
  }
});

router.patch("/:id/approve", authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { hostResponse } = req.body;
    
    const participant = await Participant.findById(id).populate('event');
    
    if (!participant) {
      return res.status(404).json({
        message: "Application not found"
      });
    }
    
    if (participant.event.hostedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You don't have permission to approve this application"
      });
    }
    
    if (participant.event.currentParticipants >= participant.event.maxParticipants) {
      return res.status(400).json({
        message: "Event is already full"
      });
    }
    
    participant.status = 'approved';
    participant.respondedAt = new Date();
    if (hostResponse) {
      participant.hostResponse = hostResponse;
    }
    
    await participant.save();
    
    const populatedParticipant = await Participant.findById(participant._id)
      .populate('user', 'name email profilePic bio')
      .populate('event', 'title date location');
    
    res.json(populatedParticipant);
  } catch (error) {
    next(error);
  }
});

router.patch("/:id/reject", authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { hostResponse } = req.body;
    
    const participant = await Participant.findById(id).populate('event');
    
    if (!participant) {
      return res.status(404).json({
        message: "Application not found"
      });
    }
    
    if (participant.event.hostedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You don't have permission to reject this application"
      });
    }
    
    participant.status = 'rejected';
    participant.respondedAt = new Date();
    if (hostResponse) {
      participant.hostResponse = hostResponse;
    }
    
    await participant.save();
    
    const populatedParticipant = await Participant.findById(participant._id)
      .populate('user', 'name email profilePic')
      .populate('event', 'title date location');
    
    res.json(populatedParticipant);
  } catch (error) {
    next(error);
  }
});

router.patch("/:id/cancel", authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const participant = await Participant.findById(id);
    
    if (!participant) {
      return res.status(404).json({
        message: "Application not found"
      });
    }
    
    if (participant.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You don't have permission to cancel this application"
      });
    }
    
    participant.status = 'cancelled';
    await participant.save();
    
    const populatedParticipant = await Participant.findById(participant._id)
      .populate('event', 'title date location')
      .populate('user', 'name email');
    
    res.json(populatedParticipant);
  } catch (error) {
    next(error);
  }
});

router.patch("/:id/rate", authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, review } = req.body;
    
    const participant = await Participant.findById(id).populate('event');
    
    if (!participant) {
      return res.status(404).json({
        message: "Participation record not found"
      });
    }
    
    if (participant.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You don't have permission to rate this event"
      });
    }
    
    if (participant.status !== 'approved' && participant.status !== 'attended') {
      return res.status(400).json({
        message: "You can only rate events you attended"
      });
    }
    
    participant.rating = rating;
    participant.review = review;
    participant.status = 'attended';
    
    await participant.save();
    
    const Event = require('../models/Event');
    const User = require('../models/User');
    
    const allRatings = await Participant.find({
      event: { $in: await Event.find({ hostedBy: participant.event.hostedBy }).select('_id') },
      rating: { $exists: true, $ne: null }
    });
    
    if (allRatings.length > 0) {
      const avgRating = allRatings.reduce((sum, p) => sum + p.rating, 0) / allRatings.length;
      await User.findByIdAndUpdate(participant.event.hostedBy, {
        'hostProfile.rating': avgRating
      });
    }
    
    res.json(participant);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

