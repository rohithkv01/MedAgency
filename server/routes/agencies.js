import express from 'express';
import Agency from '../models/Agency.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/agencies
// @desc    Get all agencies
router.get('/', async (req, res) => {
  try {
    const agencies = await Agency.find().populate('ownerId', 'name email').sort({ createdAt: -1 });
    res.json(agencies);
  } catch (error) {
    console.error('Get agencies error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/agencies/search?q=
// @desc    Search agencies with auto-suggestion
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === '') {
      return res.json([]);
    }

    const agencies = await Agency.find({
      agencyName: { $regex: q, $options: 'i' },
    })
      .select('agencyName phone address')
      .limit(10);

    res.json(agencies);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/agencies/:id
// @desc    Get single agency by ID
router.get('/:id', async (req, res) => {
  try {
    const agency = await Agency.findById(req.params.id).populate('ownerId', 'name email');
    if (!agency) {
      return res.status(404).json({ message: 'Agency not found' });
    }
    res.json(agency);
  } catch (error) {
    console.error('Get agency error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/agencies
// @desc    Create a new agency (owner only)
router.post('/', protect, async (req, res) => {
  try {
    const { agencyName, phone, address, description } = req.body;

    const agency = await Agency.create({
      agencyName,
      phone,
      address,
      description,
      ownerId: req.user._id,
    });

    res.status(201).json(agency);
  } catch (error) {
    console.error('Create agency error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/agencies/:id
// @desc    Update agency (owner only)
router.put('/:id', protect, async (req, res) => {
  try {
    const agency = await Agency.findById(req.params.id);

    if (!agency) {
      return res.status(404).json({ message: 'Agency not found' });
    }

    // Check ownership
    if (agency.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this agency' });
    }

    const { agencyName, phone, address, description } = req.body;
    agency.agencyName = agencyName || agency.agencyName;
    agency.phone = phone || agency.phone;
    agency.address = address || agency.address;
    agency.description = description !== undefined ? description : agency.description;

    const updatedAgency = await agency.save();
    res.json(updatedAgency);
  } catch (error) {
    console.error('Update agency error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/agencies/:id
// @desc    Delete agency (owner only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const agency = await Agency.findById(req.params.id);

    if (!agency) {
      return res.status(404).json({ message: 'Agency not found' });
    }

    if (agency.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this agency' });
    }

    await Agency.findByIdAndDelete(req.params.id);
    res.json({ message: 'Agency removed' });
  } catch (error) {
    console.error('Delete agency error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/agencies/owner/mine
// @desc    Get agencies owned by current user
router.get('/owner/mine', protect, async (req, res) => {
  try {
    const agencies = await Agency.find({ ownerId: req.user._id }).sort({ createdAt: -1 });
    res.json(agencies);
  } catch (error) {
    console.error('Get my agencies error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
