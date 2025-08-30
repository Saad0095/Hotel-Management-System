import Booking from "../models/booking.js";
import Room from "../models/room.js";
import Service from "../models/service.js";

// Daily bookings report
export const getDailyBookings = async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date ? new Date(date) : new Date();
    
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const dailyBookings = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfDay, $lte: endOfDay }
        }
      },
      {
        $lookup: {
          from: "rooms",
          localField: "room",
          foreignField: "_id",
          as: "roomDetails"
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userDetails"
        }
      },
      {
        $project: {
          _id: 1,
          checkInDate: 1,
          checkOutDate: 1,
          totalPrice: 1,
          status: 1,
          roomNumber: { $arrayElemAt: ["$roomDetails.roomNumber", 0] },
          userName: { $arrayElemAt: ["$userDetails.name", 0] }
        }
      }
    ]);

    const totalRevenue = dailyBookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
    const confirmedBookings = dailyBookings.filter(booking => booking.status === "confirmed").length;
    const checkedInBookings = dailyBookings.filter(booking => booking.status === "checked-in").length;

    res.json({
      date: targetDate.toISOString().split('T')[0],
      totalBookings: dailyBookings.length,
      confirmedBookings,
      checkedInBookings,
      totalRevenue,
      bookings: dailyBookings
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Monthly bookings report
export const getMonthlyBookings = async (req, res) => {
  try {
    const { year, month } = req.query;
    const targetYear = parseInt(year) || new Date().getFullYear();
    const targetMonth = parseInt(month) || new Date().getMonth() + 1;
    
    const startOfMonth = new Date(targetYear, targetMonth - 1, 1);
    const endOfMonth = new Date(targetYear, targetMonth, 0, 23, 59, 59, 999);

    const monthlyBookings = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
          revenue: { $sum: "$totalPrice" },
          bookings: { $push: "$$ROOT" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const totalBookings = monthlyBookings.reduce((sum, day) => sum + day.count, 0);
    const totalRevenue = monthlyBookings.reduce((sum, day) => sum + day.revenue, 0);
    const averageDailyBookings = totalBookings / monthlyBookings.length;
    const averageDailyRevenue = totalRevenue / monthlyBookings.length;

    res.json({
      year: targetYear,
      month: targetMonth,
      totalBookings,
      totalRevenue,
      averageDailyBookings: Math.round(averageDailyBookings * 100) / 100,
      averageDailyRevenue: Math.round(averageDailyRevenue * 100) / 100,
      dailyBreakdown: monthlyBookings
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Occupancy rate analytics
export const getOccupancyRate = async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date ? new Date(date) : new Date();
    
    // Get total rooms
    const totalRooms = await Room.countDocuments();
    
    // Get booked rooms for the date
    const bookedRooms = await Booking.countDocuments({
      checkInDate: { $lte: targetDate },
      checkOutDate: { $gte: targetDate },
      status: { $in: ["confirmed", "checked-in"] }
    });

    // Get maintenance rooms
    const maintenanceRooms = await Room.countDocuments({ status: "maintenance" });
    
    // Calculate occupancy rate
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

// Revenue tracking
export const getRevenueAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    }

    // Get revenue from bookings
    const bookingRevenue = await Booking.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalPrice" },
          totalBookings: { $sum: 1 },
          averageBookingValue: { $avg: "$totalPrice" }
        }
      }
    ]);

    // Get revenue from services
    const serviceRevenue = await Booking.aggregate([
      { $match: dateFilter },
      { $unwind: "$extraServices" },
      {
        $lookup: {
          from: "services",
          localField: "extraServices",
          foreignField: "_id",
          as: "serviceDetails"
        }
      },
      {
        $group: {
          _id: null,
          totalServiceRevenue: { $sum: { $arrayElemAt: ["$serviceDetails.price", 0] } },
          totalServices: { $sum: 1 }
        }
      }
    ]);

    const totalRevenue = (bookingRevenue[0]?.totalRevenue || 0) + (serviceRevenue[0]?.totalServiceRevenue || 0);
    const totalBookings = bookingRevenue[0]?.totalBookings || 0;
    const averageBookingValue = bookingRevenue[0]?.averageBookingValue || 0;
    const totalServices = serviceRevenue[0]?.totalServices || 0;

    res.json({
      period: startDate && endDate ? `${startDate} to ${endDate}` : "All time",
      totalRevenue,
      bookingRevenue: bookingRevenue[0]?.totalRevenue || 0,
      serviceRevenue: serviceRevenue[0]?.totalServiceRevenue || 0,
      totalBookings,
      totalServices,
      averageBookingValue: Math.round(averageBookingValue * 100) / 100
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
