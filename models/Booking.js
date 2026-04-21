const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus',
    required: true
  },
  travelDate: {
    type: Date,
    required: [true, 'Travel date is required']
  },
  seats: [{
    seatNumber: {
      type: Number,
      required: true
    },
    passengerName: {
      type: String,
      required: true,
      trim: true
    },
    passengerAge: {
      type: Number,
      required: true
    },
    passengerGender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: true
    }
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  bookingStatus: {
    type: String,
    enum: ['Confirmed', 'Cancelled', 'Pending'],
    default: 'Confirmed'
  },
  paymentStatus: {
    type: String,
    enum: ['Paid', 'Pending', 'Refunded'],
    default: 'Paid'
  },
  bookingReference: {
    type: String,
    unique: true
  }
}, { timestamps: true });

// Generate booking reference before saving
bookingSchema.pre('save', function (next) {
  if (!this.bookingReference) {
    this.bookingReference = 'BUS' + Date.now().toString().slice(-8) + Math.random().toString(36).substr(2, 4).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
