// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticate = require('../middleware/authenticate');

// Browser state-changing auth requests require the configured frontend origin.
const requireFrontendOrigin = (req, res, next) => {
  if (req.get('Origin') !== 'http://localhost:4200') return res.status(403).json({ message: 'Invalid request origin' });
  next();
};

router.post('/signup', authController.signup);
router.post('/login', requireFrontendOrigin, authController.login);
router.get('/me', authenticate, authController.me);
router.post('/logout', requireFrontendOrigin, authController.logout);

module.exports = router;
