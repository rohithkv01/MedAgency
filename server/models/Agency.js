import mongoose from 'mongoose';

const agencySchema = new mongoose.Schema({
  agencyName: {
    type: String,
    required: [true, 'Agency name is required'],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

// Text index for search functionality
agencySchema.index({ agencyName: 'text', address: 'text', description: 'text' });

const Agency = mongoose.model('Agency', agencySchema);
export default Agency;
