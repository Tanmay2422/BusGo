const Booking = require('../models/Booking');
const Bus = require('../models/Bus');

// @desc    Create a booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const { busId, travelDate, seats } = req.body;

    if (!busId || !travelDate || !seats || seats.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Bus ID, travel date, and seats are required'
      });
    }

    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ success: false, message: 'Bus not found' });
    }

    // Check if requested seats are available
    const travelDateObj = new Date(travelDate);
    const nextDay = new Date(travelDateObj);
    nextDay.setDate(nextDay.getDate() + 1);

    const existingBookings = await Booking.find({
      bus: busId,
      travelDate: { $gte: travelDateObj, $lt: nextDay },
      bookingStatus: { $ne: 'Cancelled' }
    });

    const bookedSeatNumbers = existingBookings.flatMap(b => b.seats.map(s => s.seatNumber));
    const requestedSeatNumbers = seats.map(s => s.seatNumber);

    const conflictingSeats = requestedSeatNumbers.filter(sn => bookedSeatNumbers.includes(sn));
    if (conflictingSeats.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Seats ${conflictingSeats.join(', ')} are already booked. Please select different seats.`
      });
    }

    // Validate seat numbers
    const invalidSeats = requestedSeatNumbers.filter(sn => sn < 1 || sn > bus.totalSeats);
    if (invalidSeats.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid seat numbers: ${invalidSeats.join(', ')}`
      });
    }

    const totalAmount = bus.price * seats.length;

    const booking = await Booking.create({
      user: req.user._id,
      bus: busId,
      travelDate: travelDateObj,
      seats,
      totalAmount
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('bus', 'busName busNumber source destination departureTime arrivalTime busType')
      .populate('user', 'name email');

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully!',
      booking: populatedBooking
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged-in user's bookings
// @route   GET /api/bookings/my
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('bus', 'busName busNumber source destination departureTime arrivalTime busType price')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (booking.bookingStatus === 'Cancelled') {
      return res.status(400).json({ success: false, message: 'Booking already cancelled' });
    }

    // Check if travel date has passed
    if (new Date(booking.travelDate) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel past bookings'
      });
    }

    booking.bookingStatus = 'Cancelled';
    booking.paymentStatus = 'Refunded';
    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get a single booking
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('bus')
      .populate('user', 'name email');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createBooking, getMyBookings, cancelBooking, getBookingById };
