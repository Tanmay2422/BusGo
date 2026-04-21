const express = require('express');
const router = express.Router();
const { getAllBuses, searchBuses, getBusById, createBus } = require('../controllers/busController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', getAllBuses);
router.post('/search', searchBuses);
router.get('/:id', getBusById);
router.post('/', protect, adminOnly, createBus);

module.exports = router;
