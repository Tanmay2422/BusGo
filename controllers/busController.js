const Bus = require('../models/Bus');
const Booking = require('../models/Booking');

// @desc    Get all buses
// @route   GET /api/buses
// @access  Public
const getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, count: buses.length, buses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Search buses by source, destination, and date
// @route   POST /api/buses/search
// @access  Public
const searchBuses = async (req, res) => {
  try {
    const { source, destination, date, minPrice, maxPrice, busType, sortBy } = req.body;

    if (!source || !destination) {
      return res.status(400).json({
        success: false,
        message: 'Source and destination are required'
      });
    }

    let query = {
      isActive: true,
      source: { $regex: new RegExp(source, 'i') },
      destination: { $regex: new RegExp(destination, 'i') }
    };

    if (busType) query.busType = busType;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortOptions = {};
    if (sortBy === 'price_asc') sortOptions.price = 1;
    else if (sortBy === 'price_desc') sortOptions.price = -1;
    else if (sortBy === 'departure') sortOptions.departureTime = 1;
    else sortOptions.rating = -1;

    const buses = await Bus.find(query).sort(sortOptions);

    // If date provided, get booked seats for that date
    let busesWithAvailability = buses;
    if (date) {
      const travelDate = new Date(date);
      const nextDay = new Date(travelDate);
      nextDay.setDate(nextDay.getDate() + 1);

      busesWithAvailability = await Promise.all(buses.map(async (bus) => {
        const bookings = await Booking.find({
          bus: bus._id,
          travelDate: { $gte: travelDate, $lt: nextDay },
          bookingStatus: { $ne: 'Cancelled' }
        });

        const bookedSeats = bookings.flatMap(b => b.seats.map(s => s.seatNumber));
        const availableSeats = bus.totalSeats - bookedSeats.length;

        return {
          ...bus.toObject(),
          bookedSeats,
          availableSeats
        };
      }));
    }

    res.json({
      success: true,
      count: busesWithAvailability.length,
      buses: busesWithAvailability,
      searchParams: { source, destination, date }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single bus with seat availability
// @route   GET /api/buses/:id
// @access  Public
const getBusById = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) {
      return res.status(404).json({ success: false, message: 'Bus not found' });
    }

    const { date } = req.query;
    let bookedSeats = [];

    if (date) {
      const travelDate = new Date(date);
      const nextDay = new Date(travelDate);
      nextDay.setDate(nextDay.getDate() + 1);

      const bookings = await Booking.find({
        bus: bus._id,
        travelDate: { $gte: travelDate, $lt: nextDay },
        bookingStatus: { $ne: 'Cancelled' }
      });

      bookedSeats = bookings.flatMap(b => b.seats.map(s => s.seatNumber));
    }

    res.json({
      success: true,
      bus: {
        ...bus.toObject(),
        bookedSeats,
        availableSeats: bus.totalSeats - bookedSeats.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a bus (admin)
// @route   POST /api/buses
// @access  Admin
const createBus = async (req, res) => {
  try {
    const bus = await Bus.create(req.body);
    res.status(201).json({ success: true, bus });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllBuses, searchBuses, getBusById, createBus };
