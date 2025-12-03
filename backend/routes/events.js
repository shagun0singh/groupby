const express = require('express');
const Event = require('../models/Event');
const Participant = require('../models/Participant');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Get all events with filters
router.get("/", async (req, res, next) => {
  try {
    const { skip = 0, limit = 20, category, type, city, interests, search } = req.query;
    
    const query = { status: { $in: ['open', 'full'] } };
    
    if (category) {
      query.category = category;
    }
    
    if (type) {
      query.type = type;
    }
    
    if (city) {
      query['location.city'] = new RegExp(city, 'i');
    }
    
    if (interests) {
      const interestArray = interests.split(',').map(i => i.trim().toLowerCase());
      query.interests = { $in: interestArray };
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }
    
    const events = await Event.find(query)
      .populate('hostedBy', 'name email profilePic hostProfile.rating hostProfile.verified')
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .sort({ date: 1, createdAt: -1 });
    
    const total = await Event.countDocuments(query);
    
    res.json({
      events,
      total,
      skip: parseInt(skip),
      limit: parseInt(limit)
    });
  } catch (error) {
    next(error);
  }
});

// Get single event by slug
router.get("/:slug", async (req, res, next) => {
  try {
    const { slug } = req.params;
    
    const event = await Event.findOne({ slug })
      .populate('hostedBy', 'name email profilePic bio hostProfile location');
    
    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }
    
    res.json(event);
  } catch (error) {
    next(error);
  }
});

// Create new event (requires authentication)
router.post("/", authenticate, async (req, res, next) => {
  try {
    const eventData = {
      ...req.body,
      hostedBy: req.user._id
    };
    
    // Generate slug from title
    if (!eventData.slug) {
      eventData.slug = eventData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    
    // Check for duplicate slug
    const existingEvent = await Event.findOne({ slug: eventData.slug });
    if (existingEvent) {
      eventData.slug = `${eventData.slug}-${Date.now()}`;
    }
    
    const event = new Event(eventData);
    await event.save();
    
    // Update user's host stats
    await req.user.updateOne({
      $inc: { 'stats.eventsHosted': 1, 'hostProfile.totalEvents': 1 }
    });
    
    const populatedEvent = await Event.findById(event._id)
      .populate('hostedBy', 'name email profilePic');
    
    res.status(201).json(populatedEvent);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "An event with this slug already exists"
      });
    }
    next(error);
  }
});

// Update event
router.put("/:id", authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const event = await Event.findById(id);
    
    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }
    
    // Check if user is the host
    if (event.hostedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You don't have permission to update this event"
      });
    }
    
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    ).populate('hostedBy', 'name email profilePic');
    
    res.json(updatedEvent);
  } catch (error) {
    next(error);
  }
});

// Delete event
router.delete("/:id", authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const event = await Event.findById(id);
    
    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }
    
    if (event.hostedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You don't have permission to delete this event"
      });
    }
    
    await Event.findByIdAndDelete(id);
    await Participant.deleteMany({ event: id });
    
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    next(error);
  }
});

// Get user's hosted events
router.get("/user/my-events", authenticate, async (req, res, next) => {
  try {
    const events = await Event.find({ hostedBy: req.user._id })
      .sort({ date: -1, createdAt: -1 });
    
    res.json(events);
  } catch (error) {
    next(error);
  }
});

// Get event participants (host only)
router.get("/:id/participants", authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const event = await Event.findById(id);
    
    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }
    
    if (event.hostedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You don't have permission to view participants"
      });
    }
    
    const participants = await Participant.find({ event: id })
      .populate('user', 'name email profilePic bio interests')
      .sort({ appliedAt: -1 });
    
    res.json(participants);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

