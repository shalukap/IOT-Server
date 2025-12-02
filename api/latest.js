import mongoose from "mongoose";
import Sensor from "../models/Sensor.js";

export default async function handler(req, res) {
  await mongoose.connect(process.env.MONGO_URI);
  const last = await Sensor.findOne().sort({ createdAt: -1 });
  res.json(last || {});
}

