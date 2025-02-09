// Backend (auth.js)
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Status = require("../status")
const UserProfile = require('../Profile'); // Use UserProfile model

const router = express.Router();

const generateTokens = (userId) => ({
  accessToken: jwt.sign(
    { userId },
    "idea",
    { expiresIn: '30d' }  
  ),
  refreshToken: jwt.sign(
    { userId },
    "idea",
    { expiresIn: '30d' }
  )
});

const validateAuthInput = (req, res, next) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ 
      success: false,
      message: 'Email and password are required' 
    });
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false,
      message: 'Invalid email format'
    });
  }
  
  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 8 characters long'
    });
  }
  
  next();
};

router.post('/info/:id', async(req,res) => {
  try{
    const { id } = req.params;
    const { PID } = req.body;
    const { points } = req.body;

    const status = await Status.create({
      userId: id,
      panelistID: PID,
      points: points,
    });

    res.status(201).json({ message: 'Status added successfully' });
  }catch(err){
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
})

router.get('redirect/:status', async(req, res) => {
  try{
    const {status} = req.params;
    const { PID } = req.query;
    if (status == "complete"){
      const pointUpdate = await Status.findOne({where: {panelistID: PID}}); 
      pointUpdate.update({status});
      const point = pointUpdate.points ;

      const ProfileUpdate = await UserProfile.findOne({where: {id : pointUpdate.userId}});
      const availablePoint = ProfileUpdate.point;
      ProfileUpdate.update({point : availablePoint + point});

      res.status(200).json({ message: 'Points added successfully' });
    }else{
      const pointUpdate = await Status.findOne({where: {panelistID: PID}}); 
      pointUpdate.update({status});
    }

  }catch(err){
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
})

router.get('/profiles', async (req, res) => {
  try {
    const { email } = req.query;
    const decodedEmail = decodeURIComponent(email);

    const profile = await UserProfile.findOne({ where: { email : decodedEmail } });

    if (!profile) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    console.log(profile)

    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/p/profiles', async (req, res) => {
  try {
    const { email } = req.query;
    const decode = decodeURIComponent(email);
    console.log('Decoded email:', decode);  // Log the decoded email
    const data = req.body;
    console.log('Request data:', data);  // Log the incoming request data

    

    const userProfile = await UserProfile.findOne({ where: { email: decode } });

    if (!userProfile) {
      return res.status(404).json({ message: 'User profile not found' });
    }
    console.log('User profile found:', userProfile);  // Log the found user profile

    await userProfile.update(data);
    console.log('Profile updated successfully');

    const updatedProfile = await UserProfile.findOne({ where: { email: decode } });
    console.log('Updated profile:', updatedProfile);

    res.status(200).json({ message: 'User profile updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Register new user
router.post('/register', validateAuthInput, async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await UserProfile.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered',
      });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await UserProfile.create({
      email,
      password: hashedPassword,
    });

    const tokens = generateTokens(newUser.id);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      ...tokens,
      email: newUser.email,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again later.',
    });
  }
});

// Login user
router.post('/login', validateAuthInput, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserProfile.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const tokens = generateTokens(user.id);

    res.json({
      success: true,
      message: 'Login successful',
      ...tokens,
      email : user.email
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again later.',
    });
  }
});

module.exports = router;
