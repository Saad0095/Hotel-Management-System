import Booking from "../models/booking.js";
import Room from "../models/room.js";
import Service from "../models/service.js";

// Create new booking
export const createBooking = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate, extraServices } = req.body;
    
    // Check if room is available
    const roomData = await Room.findById(room);
    if (!roomData) return res.status(404).json({ message: "Room not found!" });
    if (roomData.status !== "available") {
      return res.status(400).json({ message: "Room is not available!" });
    }

    // Calculate total price
    const nights = Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24));
    let totalPrice = roomData.pricePerNight * nights;

    // Add services price
    if (extraServices && extraServices.length > 0) {
      const services = await Service.find({ _id: { $in: extraServices } });
      const servicesPrice = services.reduce((sum, service) => sum + service.price, 0);
      totalPrice += servicesPrice;
    }

    const booking = await Booking.create({
      room: [room],
      user: req.user.id,
      checkInDate,
      checkOutDate,
      totalPrice,
      extraServices
    });

    // Update room status to booked
    await Room.findByIdAndUpdate(room, { status: "booked" });

    res.status(201).json({ message: "Booking created successfully!", booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("room", "roomNumber roomType")
      .populate("user", "name email")
      .populate("extraServices", "name price");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get booking by ID
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("room", "roomNumber roomType")
      .populate("user", "name email")
      .populate("extraServices", "name price");
    
    if (!booking) return res.status(404).json({ message: "Booking not found!" });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Check-in functionality (Admin only)
export const checkIn = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found!" });
    
    if (booking.status !== "confirmed") {
      return res.status(400).json({ message: "Booking must be confirmed before check-in!" });
    }

    // Update booking status
    booking.status = "checked-in";
    await booking.save();

    res.json({ message: "Check-in successful!", booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Check-out functionality (Admin only)
export const checkOut = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found!" });
    
    if (booking.status !== "checked-in") {
      return res.status(400).json({ message: "Guest must be checked-in before check-out!" });
    }

    // Update booking status
    booking.status = "checked-out";
    await booking.save();

    // Update room status to available
    await Room.findByIdAndUpdate(booking.room[0], { status: "available" });

    res.json({ message: "Check-out successful!", booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update booking
export const updateBooking = async (req, res) => {
  try {
    const { checkInDate, checkOutDate, extraServices } = req.body;
    
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found!" });

    // Recalculate total price if dates or services change
    let totalPrice = booking.totalPrice;
    if (checkInDate || checkOutDate) {
      const room = await Room.findById(booking.room[0]);
      const nights = Math.ceil((new Date(checkOutDate || booking.checkOutDate) - new Date(checkInDate || booking.checkInDate)) / (1000 * 60 * 60 * 24));
      totalPrice = room.pricePerNight * nights;
    }

    if (extraServices) {
      const services = await Service.find({ _id: { $in: extraServices } });
      const servicesPrice = services.reduce((sum, service) => sum + service.price, 0);
      totalPrice += servicesPrice;
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { 
        checkInDate: checkInDate || booking.checkInDate,
        checkOutDate: checkOutDate || booking.checkOutDate,
        extraServices: extraServices || booking.extraServices,
        totalPrice
      },
      { new: true }
    );

    res.json({ message: "Booking updated successfully!", booking: updatedBooking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete booking
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found!" });

    // Update room status to available if booking is cancelled
    if (booking.status === "confirmed" || booking.status === "checked-in") {
      await Room.findByIdAndUpdate(booking.room[0], { status: "available" });
    }

    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Booking deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
