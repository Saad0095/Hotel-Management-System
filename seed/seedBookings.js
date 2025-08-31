// seedBookings.js
import connectDB from "../db/index.js";
import "dotenv/config";

import Room from "../models/room.js";
import Service from "../models/service.js";
import User from "../models/user.js";
import Booking from "../models/booking.js";

const seedBookings = async () => {
  try {
    await connectDB();

    // Fetch existing rooms, users, and services
    const rooms = await Room.find();
    const users = await User.find();
    const services = await Service.find();

    if (!rooms.length || !users.length || !services.length) {
      console.log("❌ Make sure rooms, users, and services are already seeded.");
      process.exit(1);
    }

    // Clear existing bookings
    await Booking.deleteMany();

    // Create 10 bookings
    const bookings = [];
    for (let i = 0; i < 10; i++) {
      const randomRoom = rooms[Math.floor(Math.random() * rooms.length)];
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomServices = [
        services[Math.floor(Math.random() * services.length)],
        services[Math.floor(Math.random() * services.length)],
      ];

      // Random check-in and check-out dates
      const checkIn = new Date();
      checkIn.setDate(checkIn.getDate() + i); // staggered check-ins
      const checkOut = new Date(checkIn);
      checkOut.setDate(checkOut.getDate() + 2); // 2 nights stay

      bookings.push({
        rooms: [randomRoom._id],
        user: randomUser._id,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        totalPrice: randomRoom.pricePerNight * 2 + randomServices.reduce((sum, s) => sum + s.price, 0),
        extraServices: randomServices.map(s => s._id),
        status: "pending",
      });
    }

    const createdBookings = await Booking.insertMany(bookings);
    console.log(`✅ ${createdBookings.length} bookings seeded successfully!`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding bookings:", error);
    process.exit(1);
  }
};

seedBookings();
