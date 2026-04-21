const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Bus = require('../models/Bus');
const User = require('../models/User');

dotenv.config();

const buses = [
  {
    busName: 'Royal Cruiser Express',
    busNumber: 'MH-01-AB-1234',
    busType: 'AC Sleeper',
    source: 'Mumbai',
    destination: 'Pune',
    departureTime: '06:00 AM',
    arrivalTime: '09:30 AM',
    duration: '3h 30m',
    price: 450,
    totalSeats: 40,
    amenities: ['WiFi', 'AC', 'Charging Point', 'Blanket', 'Water Bottle'],
    rating: 4.5
  },
  {
    busName: 'Sunrise Travels',
    busNumber: 'KA-05-CD-5678',
    busType: 'AC Seater',
    source: 'Bangalore',
    destination: 'Chennai',
    departureTime: '08:00 AM',
    arrivalTime: '02:30 PM',
    duration: '6h 30m',
    price: 650,
    totalSeats: 40,
    amenities: ['WiFi', 'AC', 'Charging Point', 'Snacks'],
    rating: 4.2
  },
  {
    busName: 'Golden Arrow',
    busNumber: 'DL-07-EF-9012',
    busType: 'Semi-Sleeper',
    source: 'Delhi',
    destination: 'Agra',
    departureTime: '07:00 AM',
    arrivalTime: '10:30 AM',
    duration: '3h 30m',
    price: 350,
    totalSeats: 40,
    amenities: ['AC', 'Charging Point'],
    rating: 4.0
  },
  {
    busName: 'Coastal Express',
    busNumber: 'GJ-09-GH-3456',
    busType: 'Sleeper',
    source: 'Ahmedabad',
    destination: 'Mumbai',
    departureTime: '10:00 PM',
    arrivalTime: '06:00 AM',
    duration: '8h',
    price: 800,
    totalSeats: 36,
    amenities: ['AC', 'Blanket', 'Pillow', 'Charging Point', 'Water Bottle'],
    rating: 4.3
  },
  {
    busName: 'Deccan Queen',
    busNumber: 'MH-12-IJ-7890',
    busType: 'Seater',
    source: 'Pune',
    destination: 'Nashik',
    departureTime: '09:00 AM',
    arrivalTime: '01:00 PM',
    duration: '4h',
    price: 280,
    totalSeats: 45,
    amenities: ['Charging Point'],
    rating: 3.8
  },
  {
    busName: 'VRL Travels Premium',
    busNumber: 'KA-01-KL-2345',
    busType: 'AC Sleeper',
    source: 'Bangalore',
    destination: 'Hyderabad',
    departureTime: '09:00 PM',
    arrivalTime: '06:00 AM',
    duration: '9h',
    price: 950,
    totalSeats: 36,
    amenities: ['WiFi', 'AC', 'Blanket', 'Pillow', 'Charging Point', 'Snacks', 'Water Bottle'],
    rating: 4.7
  },
  {
    busName: 'Rajdhani Express Bus',
    busNumber: 'RJ-03-MN-6789',
    busType: 'AC Seater',
    source: 'Jaipur',
    destination: 'Delhi',
    departureTime: '06:30 AM',
    arrivalTime: '11:30 AM',
    duration: '5h',
    price: 550,
    totalSeats: 40,
    amenities: ['WiFi', 'AC', 'Charging Point', 'Snacks'],
    rating: 4.4
  },
  {
    busName: 'Kerala Express',
    busNumber: 'KL-07-OP-1234',
    busType: 'Sleeper',
    source: 'Kochi',
    destination: 'Bangalore',
    departureTime: '08:00 PM',
    arrivalTime: '07:00 AM',
    duration: '11h',
    price: 1100,
    totalSeats: 36,
    amenities: ['AC', 'Blanket', 'Pillow', 'Charging Point', 'Water Bottle'],
    rating: 4.1
  },
  {
    busName: 'Himalayan Volvo',
    busNumber: 'HP-01-QR-5678',
    busType: 'AC Sleeper',
    source: 'Delhi',
    destination: 'Manali',
    departureTime: '05:00 PM',
    arrivalTime: '09:00 AM',
    duration: '16h',
    price: 1500,
    totalSeats: 40,
    amenities: ['WiFi', 'AC', 'Blanket', 'Pillow', 'Charging Point', 'Snacks', 'Water Bottle'],
    rating: 4.6
  },
  {
    busName: 'Konkan Kanya',
    busNumber: 'MH-06-ST-9012',
    busType: 'Semi-Sleeper',
    source: 'Mumbai',
    destination: 'Goa',
    departureTime: '11:00 PM',
    arrivalTime: '08:00 AM',
    duration: '9h',
    price: 750,
    totalSeats: 40,
    amenities: ['AC', 'Charging Point', 'Water Bottle'],
    rating: 4.2
  }
];

const adminUser = {
  name: 'Admin User',
  email: 'admin@busbook.com',
  password: 'admin123',
  role: 'admin'
};

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Bus.deleteMany({});
    await User.deleteMany({ email: 'admin@busbook.com' });
    console.log('🗑️  Cleared existing data');

    // Insert buses
    await Bus.insertMany(buses);
    console.log(`🚌 Inserted ${buses.length} buses`);

    // Create admin user
    await User.create(adminUser);
    console.log('👤 Admin user created: admin@busbook.com / admin123');

    console.log('\n✅ Database seeded successfully!');
    console.log('\nTest Credentials:');
    console.log('  Admin: admin@busbook.com / admin123');
    console.log('\nSample Routes:');
    console.log('  Mumbai → Pune');
    console.log('  Bangalore → Chennai');
    console.log('  Delhi → Agra');
    console.log('  Mumbai → Goa');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedData();
