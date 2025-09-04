import Booking from "../models/booking.js";
import Room from "../models/room.js";

export const getDailyBookings = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const dailyBookings = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfDay, $lte: endOfDay },
        },
      },
      {
        $lookup: {
          from: "rooms",
          localField: "rooms",
          foreignField: "_id",
          as: "roomDetails",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
      {
        $project: {
          bookingId: "$_id",
          user: "$userDetails.name",
          email: "$userDetails.email",
          rooms: "$roomDetails.roomNumber",
          status: 1,
          createdAt: 1,
        },
      },
    ]);

    res.json(dailyBookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOccupancyRate = async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date ? new Date(date) : new Date();

    const totalRooms = await Room.countDocuments();

    const bookedRooms = await Booking.countDocuments({
      checkInDate: { $lte: targetDate },
      checkOutDate: { $gte: targetDate },
      status: { $in: ["confirmed", "checked-in"] }
    });

    const maintenanceRooms = await Room.countDocuments({ status: "maintenance" });

    const availableRooms = totalRooms - bookedRooms - maintenanceRooms;
    const occupancyRate = ((bookedRooms / totalRooms) * 100).toFixed(2);
    const availabilityRate = ((availableRooms / totalRooms) * 100).toFixed(2);
    const maintenanceRate = ((maintenanceRooms / totalRooms) * 100).toFixed(2);

    res.json({
      date: targetDate.toISOString().split('T')[0],
      totalRooms,
      bookedRooms,
      availableRooms,
      maintenanceRooms,
      occupancyRate: parseFloat(occupancyRate),
      availabilityRate: parseFloat(availabilityRate),
      maintenanceRate: parseFloat(maintenanceRate)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMonthlyBookings = async (req, res) => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);

    const monthlyBookings = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: { $dayOfMonth: "$createdAt" },
          bookings: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const totalBookings = monthlyBookings.reduce(
      (sum, day) => sum + day.bookings,
      0
    );

    const averageDailyBookings =
      monthlyBookings.length > 0
        ? totalBookings / monthlyBookings.length
        : 0;

    res.json({ monthlyBookings, totalBookings, averageDailyBookings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getRevenueAnalytics = async (req, res) => {
  try {
    const roomRevenue = await Booking.aggregate([
      { $unwind: "$rooms" },
      {
        $lookup: {
          from: "rooms",
          localField: "rooms",
          foreignField: "_id",
          as: "roomDetails",
        },
      },
      { $unwind: "$roomDetails" },
      {
        $group: {
          _id: null,
          totalRoomRevenue: { $sum: "$roomDetails.pricePerNight" },
          totalRooms: { $sum: 1 },
        },
      },
    ]);

    const serviceRevenue = await Booking.aggregate([
      { $unwind: "$extraServices" },
      {
        $lookup: {
          from: "services",
          localField: "extraServices",
          foreignField: "_id",
          as: "serviceDetails",
        },
      },
      { $unwind: "$serviceDetails" },
      {
        $group: {
          _id: null,
          totalServiceRevenue: { $sum: "$serviceDetails.price" },
          totalServices: { $sum: 1 },
        },
      },
    ]);

    const totalRoomRevenue =
      roomRevenue.length > 0 ? roomRevenue[0].totalRoomRevenue : 0;
    const totalRooms =
      roomRevenue.length > 0 ? roomRevenue[0].totalRooms : 0;

    const totalServiceRevenue =
      serviceRevenue.length > 0 ? serviceRevenue[0].totalServiceRevenue : 0;
    const totalServices =
      serviceRevenue.length > 0 ? serviceRevenue[0].totalServices : 0;

    const totalRevenue = totalRoomRevenue + totalServiceRevenue;

    const totalRoomsAvailable = await Room.countDocuments();
    const bookedRooms = await Booking.countDocuments({
      status: { $in: ["confirmed", "checked-in"] }
    });
    const occupancyRate =
      totalRoomsAvailable > 0
        ? ((bookedRooms / totalRoomsAvailable) * 100).toFixed(2)
        : 0;

    res.json({
      totalRoomRevenue,
      totalServiceRevenue,
      totalRevenue,
      occupancyRate,
      totalServices,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
