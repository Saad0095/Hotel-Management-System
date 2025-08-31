import Service from "../models/service.js";

export const createService = async (req, res) => {
  try {
    const { name, price, description } = req.body;
    
    const existingService = await Service.findOne({ name: { $regex: new RegExp(name, 'i') } });
    if (existingService) {
      return res.status(400).json({ message: "Service with this name already exists!" });
    }

    const service = await Service.create({ name, price, description });
    res.status(201).json({ message: "Service created successfully!", service });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ name: 1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found!" });
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateService = async (req, res) => {
  try {
    const { name, price, description } = req.body;
    
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found!" });

    if (name && name !== service.name) {
      const existingService = await Service.findOne({ 
        name: { $regex: new RegExp(name, 'i') },
        _id: { $ne: req.params.id }
      });
      if (existingService) {
        return res.status(400).json({ message: "Service with this name already exists!" });
      }
    }

    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      { name, price, description },
      { new: true }
    );

    res.json({ message: "Service updated successfully!", service: updatedService });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found!" });

    const Booking = (await import("../models/booking.js")).default;
    const attachedBookings = await Booking.countDocuments({
      extraServices: req.params.id
    });

    if (attachedBookings > 0) {
      return res.status(400).json({ 
        message: `Cannot delete service. It is attached to ${attachedBookings} booking(s).` 
      });
    }

    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: "Service deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPopularServices = async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    
    const popularServices = await Service.aggregate([
      {
        $lookup: {
          from: "bookings",
          localField: "_id",
          foreignField: "extraServices",
          as: "bookings"
        }
      },
      {
        $addFields: {
          usageCount: { $size: "$bookings" }
        }
      },
      {
        $sort: { usageCount: -1 }
      },
      {
        $limit: parseInt(limit)
      },
      {
        $project: {
          _id: 1,
          name: 1,
          price: 1,
          description: 1,
          usageCount: 1
        }
      }
    ]);

    res.json(popularServices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
