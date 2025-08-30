import Service from "../models/service.js";
import connectDB from "../db/index.js";

const services = [
  {
    name: "Laundry Service",
    price: 25,
    description: "Professional laundry and dry cleaning service"
  },
  {
    name: "Taxi Service",
    price: 50,
    description: "Airport pickup and drop-off service"
  },
  {
    name: "Spa Treatment",
    price: 120,
    description: "Relaxing spa and massage services"
  },
  {
    name: "Room Service",
    price: 15,
    description: "24/7 in-room dining service"
  },
  {
    name: "WiFi Premium",
    price: 10,
    description: "High-speed internet access"
  },
  {
    name: "Gym Access",
    price: 20,
    description: "Access to fitness center and equipment"
  }
];

const seedServices = async () => {
  try {
    await connectDB();
    
    // Clear existing services
    await Service.deleteMany({});
    
    // Insert new services
    const createdServices = await Service.insertMany(services);
    
    console.log(`${createdServices.length} services seeded successfully!`);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding services:", error);
    process.exit(1);
  }
};

seedServices();
