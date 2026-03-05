//For login and signup endpoints
const express = require('express');
const jwt = require('jsonwebtoken');
const Ngo = require('../models/NGO');
const Doctor = require('../models/Doctor');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

                                // ============ NGO ROUTES ============

                                // @route   POST /api/auth/ngo/register
// @desc    Register new NGO
router.post('/ngo/register', async (req, res) => {
  try {
    const { name, ngoName, state, phone, email, password } = req.body;

    // Check if NGO already exists
    const existingNgo = await Ngo.findOne({ email });
    if (existingNgo) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // Create NGO
    const ngo = await Ngo.create({
      name,
      ngoName,
      state,
      phone,
      email,
      password
    });

    // Generate token
    const token = generateToken(ngo._id, 'ngo');

    res.status(201).json({
      success: true,
      data: {
        id: ngo._id,
        name: ngo.name,
        ngoName: ngo.ngoName,
        email: ngo.email,
        ngoKey: ngo.ngoKey,
        role: 'ngo'
      },
      token
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

                                  // @route   POST /api/auth/ngo/login
// @desc    Login NGO
router.post('/ngo/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find NGO and include password
    const ngo = await Ngo.findOne({ email }).select('+password');
    if (!ngo) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await ngo.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(ngo._id, 'ngo');

    res.json({
      success: true,
      data: {
        id: ngo._id,
        name: ngo.name,
        ngoName: ngo.ngoName,
        email: ngo.email,
        ngoKey: ngo.ngoKey,
        role: 'ngo'
      },
      token
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

                               // ============ DOCTOR ROUTES ============

// @route   POST /api/auth/doctor/register
// @desc    Register new Doctor
router.post('/doctor/register', async (req, res) => {
  try {
    const { name, email, password, ngoKey, specialisation, experience, phone } = req.body;

    // Check if doctor already exists
    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // Verify NGO key exists
    const ngo = await Ngo.findOne({ ngoKey });
    if (!ngo) {
      return res.status(400).json({ success: false, message: 'Invalid NGO key' });
    }

    // Create Doctor
    const doctor = await Doctor.create({
      name,
      email,
      password,
      ngoKey,
      ngo: ngo._id,
      specialisation,
      experience,
      phone
    });

    // Generate token
    const token = generateToken(doctor._id, 'doctor');

    res.status(201).json({
      success: true,
      data: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        specialisation: doctor.specialisation,
        ngoName: ngo.ngoName,
        role: 'doctor'
      },
      token
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

                            // @route   POST /api/auth/doctor/login
// @desc    Login Doctor
router.post('/doctor/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find doctor and include password
    const doctor = await Doctor.findOne({ email }).select('+password');
    if (!doctor) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await doctor.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Get NGO name
    const ngo = await Ngo.findById(doctor.ngo);

    // Generate token
    const token = generateToken(doctor._id, 'doctor');

    res.json({
      success: true,
      data: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        specialisation: doctor.specialisation,
        ngoName: ngo ? ngo.ngoName : null,
        role: 'doctor'
      },
      token
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


                                     // @route   GET /api/auth/me
                                    // @desc    Get current logged in user

router.get('/me', protect, async (req, res) => {
  res.json({
    success: true,
    data: req.user
  });
});

module.exports = router;