import connectDB from "../db/index.js";
import Room from "../models/room.js";
import "dotenv/config";

const seedRooms = async () => {
  try {
    await connectDB();

    await Room.deleteMany();

    const rooms = await Room.insertMany([
      {
        roomNumber: "101",
        roomType: "Single",
        description: "Cozy single room with a nice view of the garden.",
        pricePerNight: 3000,
        amenities: ["WiFi", "AC", "TV", "Room Service"],
        images: ["https://picsum.photos/400/300?random=1"],
      },
      {
        roomNumber: "102",
        roomType: "Double",
        description: "Spacious double room with balcony access.",
        pricePerNight: 5000,
        amenities: ["WiFi", "Mini Fridge", "Balcony", "AC"],
        images: ["https://picsum.photos/400/300?random=2"],
      },
      {
        roomNumber: "103",
        roomType: "Triple",
        description:
          "Perfect for families, triple bed setup with modern decor.",
        pricePerNight: 7000,
        amenities: ["WiFi", "TV", "Hot Water", "Mini Fridge"],
        images: ["https://picsum.photos/400/300?random=3"],
      },
      {
        roomNumber: "104",
        roomType: "Quad",
        description: "Large quad room for group stays, with city view.",
        pricePerNight: 9000,
        amenities: ["WiFi", "AC", "Room Heater", "Work Desk"],
        images: ["https://picsum.photos/400/300?random=4"],
      },
      {
        roomNumber: "201",
        roomType: "Single",
        description: "Budget single room with basic amenities.",
        pricePerNight: 2500,
        amenities: ["WiFi", "Fan"],
        images: ["https://picsum.photos/400/300?random=5"],
      },
      {
        roomNumber: "202",
        roomType: "Double",
        description: "Double room with pool-side view.",
        pricePerNight: 5500,
        amenities: ["WiFi", "AC", "Swimming Pool Access", "TV"],
        images: ["https://picsum.photos/400/300?random=6"],
      },
      {
        roomNumber: "203",
        roomType: "Triple",
        description: "Spacious triple room with attached kitchenette.",
        pricePerNight: 7500,
        amenities: ["WiFi", "AC", "Kitchenette", "Smart TV"],
        images: ["https://picsum.photos/400/300?random=7"],
      },
      {
        roomNumber: "204",
        roomType: "Quad",
        description: "Luxury quad room with premium furniture.",
        pricePerNight: 12000,
        amenities: ["WiFi", "AC", "Mini Bar", "Work Desk", "Room Service"],
        images: ["https://picsum.photos/400/300?random=8"],
      },
    ]);

    console.log("🌱 Rooms Seeded:", rooms);
    process.exit();
  } catch (error) {
    console.error("❌ Error Seeding Rooms:", error);
    process.exit(1);
  }
};

seedRooms();
