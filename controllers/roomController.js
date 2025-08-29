import Room from "../models/room";

export const createRoom = async (req, res) => {
  try {
    const room = await Room.create(req.body);
    res.json({ message: "Room Created Successfully!", room });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    if (!rooms || rooms.length)
      return res.status(404).json({ message: "Roooms Not Found!" });
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

export const updateRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Rooom Not Found!" });
    const updatedRoom = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ message: "Room Updated Successfully!", updatedRoom });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Rooom Not Found!" });
    await Room.findByIdAndDelete(req.params.id);
    res.json({ message: "Room Deleted Successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
