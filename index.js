import express from "express";
import "dotenv/config";
import path from "path"
import connectDB from "./db/index.js";
import roomRoutes from "./routes/roomRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
const app = express();

connectDB();
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on localhost:${port}`);
});
