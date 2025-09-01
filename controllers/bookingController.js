import Booking from "../models/booking.js";
import Room from "../models/room.js";
import Service from "../models/service.js";
import User from "../models/user.js";
import {
  sendBookingConfirmation,
  sendCancelBookingEmail,
  sendCheckInEmail,
  sendCheckOutEmail,
} from "../utils/nodemailer.js";

export const createBooking = async (req, res) => {
  try {
    const { rooms, checkInDate, checkOutDate, extraServices, customerId } =
      req.body;

    let userId;
    if (req.user.role == "customer") {
      userId = req.user.id;
    } else if (req.user.role !== "customer") {
      if (!customerId) {
        return res.status(400).json({
          message: "Customer ID is required for receptionist bookings",
        });
      }
      const customer = await User.findById(customerId);
      if (!customer || customer.role !== "customer") {
        return res.status(400).json({ message: "Invalid customer ID" });
      }
      userId = customerId;
    }
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    const roomData = await Room.find({ _id: { $in: rooms } });

    if (roomData.length !== rooms.length) {
      return res.status(404).json({ message: "One or more rooms not found!" });
    }

    const alreadyBooked = await Booking.find({
      rooms: { $in: rooms },
      checkInDate: { $lt: checkOut },
      checkOutDate: { $gt: checkIn },
    });

    if (alreadyBooked.length > 0) {
      return res
        .status(400)
        .json({ message: "Some rooms are already booked for these dates!" });
    }

    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

    let totalPrice = roomData.reduce(
      (sum, room) => sum + room.pricePerNight * nights,
      0
    );

    let services = [];
    if (extraServices && extraServices.length > 0) {
      services = await Service.find({ _id: { $in: extraServices } });
      const servicesPrice = services.reduce(
        (sum, service) => sum + service.price,
        0
      );
      totalPrice += servicesPrice;
    }

    const booking = await Booking.create({
      rooms,
      user: userId,
      createdBy: req.user._id,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      totalPrice,
      extraServices,
    });

    await Room.updateMany({ _id: { $in: rooms } }, { status: "booked" });

    await sendBookingConfirmation(
      booking.user.email,
      booking,
      booking.user,
      roomData,
      services
    );

    res.status(201).json({ message: "Booking created successfully!", booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("rooms", "roomNumber roomType")
      .populate("user", "name email phone")
      .populate("createdBy", "name email")
      .populate("extraServices", "name price");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("rooms", "roomNumber roomType")
      .populate("user", "name email phone")
      .populate("createdBy", "name email")
      .populate("extraServices", "name price");

    if (!booking)
      return res.status(404).json({ message: "Booking not found!" });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const { checkInDate, checkOutDate, extraServices } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking)
      return res.status(404).json({ message: "Booking not found!" });

    const checkIn = new Date(checkInDate || booking.checkInDate);
    const checkOut = new Date(checkOutDate || booking.checkOutDate);

    const conflict = await Booking.findOne({
      _id: { $ne: booking._id },
      rooms: { $in: booking.rooms },
      checkInDate: { $lt: checkOut },
      checkOutDate: { $gt: checkIn },
    });

    if (conflict) {
      return res
        .status(400)
        .json({ message: "Rooms are already booked for the new dates!" });
    }

    const roomData = await Room.find({ _id: { $in: booking.rooms } });
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

    let totalPrice = roomData.reduce(
      (sum, room) => sum + room.pricePerNight * nights,
      0
    );

    let updatedServices = extraServices || booking.extraServices;
    if (updatedServices && updatedServices.length > 0) {
      const services = await Service.find({ _id: { $in: updatedServices } });
      const servicesPrice = services.reduce(
        (sum, service) => sum + service.price,
        0
      );
      totalPrice += servicesPrice;
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        checkInDate: checkIn,
        checkOutDate: checkOut,
        extraServices: updatedServices,
        totalPrice,
      },
      { new: true }
    );

    res.json({
      message: "Booking updated successfully!",
      booking: updatedBooking,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const checkIn = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking)
      return res.status(404).json({ message: "Booking not found!" });

    if (booking.status !== "confirmed") {
      return res
        .status(400)
        .json({ message: "Booking must be confirmed before check-in!" });
    }

    booking.status = "checked-in";
    await booking.save();
    await sendCheckInEmail(booking.user.email, booking, booking.user);

    res.json({ message: "Check-in successful!", booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const checkOut = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking)
      return res.status(404).json({ message: "Booking not found!" });

    if (booking.status !== "checked-in") {
      return res
        .status(400)
        .json({ message: "Guest must be checked-in before check-out!" });
    }

    booking.status = "checked-out";
    await booking.save();

    await Room.updateMany(
      { _id: { $in: booking.rooms } },
      { status: "available" }
    );

    await sendCheckOutEmail(booking.user.email, booking, booking.user);

    res.json({ message: "Check-out successful!", booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking)
      return res.status(404).json({ message: "Booking not found!" });

    if (booking.status === "checked-out") {
      return res
        .status(400)
        .json({ message: "Cannot cancel a booking after check-out!" });
    }

    booking.status = "cancelled";
    await booking.save();

    await Room.updateMany(
      { _id: { $in: booking.rooms } },
      { status: "available" }
    );

    await sendCancelBookingEmail(booking.user.email, booking, booking.user);

    res.json({ message: "Booking cancelled successfully!", booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking)
      return res.status(404).json({ message: "Booking not found!" });

    if (["confirmed", "checked-in"].includes(booking.status)) {
      await Room.updateMany(
        { _id: { $in: booking.rooms } },
        { status: "available" }
      );
    }

    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Booking deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
