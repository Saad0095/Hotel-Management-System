import Room from "../models/room.js";

export const createRoom = async (req, res) => {
  try {
    const images = req.files?.map((file) => `/uploads/${file.filename}`) || [];
    const room = await Room.create({ ...req.body, images });
    res.json({ message: "Room Created Successfully!", room });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    if (!rooms) return res.status(404).json({ message: "Roooms Not Found!" });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Rooom Not Found!" });
    res.json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getRoomStatus = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Rooom Not Found!" });
    res.json({ status: room.status });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Rooom Not Found!" });

    const images = req.files?.map((file) => `/uploads/${file.filename}`) || [];

    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      { ...req.body, images: images.length > 0 ? images : room.images },
      {
        new: true,
      }
    );
    res.json({ message: "Room Updated Successfully!", updatedRoom });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room Not Found!" });
    
  
    const activeBookings = await Booking.countDocuments({
      rooms: req.params.id,
      status: { $in: ["confirmed", "checked-in"] }
    });
    
    if (activeBookings > 0) {
      return res.status(400).json({ 
        message: "Cannot delete room with active bookings!" 
      });
    }
    
    await Room.findByIdAndDelete(req.params.id);
    res.json({ message: "Room Deleted Successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
