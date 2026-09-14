const express = require('express');
const { getDashboardStats, getUsers } = require('../controllers/adminController');
const protect = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

const router = express.Router();

router.use(protect, adminOnly);

router.get('/dashboard', getDashboardStats);
router.get('/users', getUsers);

module.exports = router;
