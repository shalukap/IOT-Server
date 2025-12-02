import mongoose from "mongoose";
import Sensor from "../models/Sensor.js";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const key = req.headers["x-api-key"];
    if (key !== process.env.API_KEY) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      await mongoose.connect(process.env.MONGO_URI);
      const doc = new Sensor(req.body);
      await doc.save();
      res.json({ status: "ok", id: doc._id });
    } catch (err) {
      res.status(500).json({ error: "server" });
    }
  } else {
    res.status(405).json({ error: "method not allowed" });
  }
}