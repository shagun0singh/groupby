const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      minlength: [2, 'First name must be at least 2 characters']
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      minlength: [2, 'Last name must be at least 2 characters']
    },
    name: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      trim: true,
      match: [/^\+?[0-9]{10,15}$/, 'Please provide a valid phone number']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters']
    },
    role: {
      type: String,
      enum: ['user', 'host', 'both'],
      default: 'user'
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [500, 'Bio cannot exceed 500 characters']
    },
    age: {
      type: Number,
      min: [13, 'Age must be at least 13'],
      max: [120, 'Age must be valid']
    },
    interests: [
      {
        type: String,
        trim: true,
        lowercase: true
      }
    ],
    profilePic: {
      type: String,
      default: ''
    },
    location: {
      city: {
        type: String,
        trim: true
      },
      state: {
        type: String,
        trim: true
      },
      country: {
        type: String,
        trim: true
      }
    },
    hostProfile: {
      verified: {
        type: Boolean,
        default: false
      },
      rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
      },
      totalEvents: {
        type: Number,
        default: 0
      },
      totalParticipants: {
        type: Number,
        default: 0
      },
      specialties: [{
        type: String,
        trim: true
      }],
      socialLinks: {
        instagram: String,
        linkedin: String,
        twitter: String,
        website: String
      }
    },
    stats: {
      eventsAttended: {
        type: Number,
        default: 0
      },
      eventsHosted: {
        type: Number,
        default: 0
      },
      rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
      }
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

userSchema.pre('save', async function preSave(next) {
  if (this.isModified('firstName') || this.isModified('lastName')) {
    const parts = [this.firstName, this.lastName].filter(Boolean);
    this.name = parts.join(' ');
  }

  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function toJSON() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);

