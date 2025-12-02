import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from 'dotenv';

import cookieParser from "cookie-parser";

dotenv.config();


const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin:"http://localhost:5173",credentials: true}));

const PORT = process.env.PORT || 5000;
const API_KEY = process.env.API_KEY || 'changeme';

let mongoUrl=process.env.MONGO_URI;

mongoose.connect(mongoUrl)
let connection =mongoose.connection;
connection.once("open", () => {
    console.log("MongoDB database connection established successfully");
    
});
/*
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=>console.log('MongoDB connected'))
  .catch(e=>console.error('MongoDB failed', e));
*/
const sensorSchema = new mongoose.Schema({
  deviceId: { type: String, default: 'unknown' },
  temperature: Number, humidity: Number, soil: Number, pir: Boolean, relay: Boolean,
  createdAt: { type: Date, default: Date.now }
});
const Sensor = mongoose.model('Sensor', sensorSchema);

function requireApiKey(req, res, next) {
  const key = req.header('x-api-key');
  if (!key || key !== API_KEY) return res.status(401).json({ error: 'Unauthorized' });
  next();
}

app.post('/api/sensor-data', requireApiKey, async (req,res)=>{
  const payload = req.body;
  try{
    const doc = new Sensor(payload);
    await doc.save();
    res.json({ status:'ok', id: doc._id });
  }catch(e){
    console.error(e);
    res.status(500).json({ error:'server' });
  }
});

app.get('/api/sensor-data/latest', async (req,res)=>{
  const last = await Sensor.findOne({}).sort({ createdAt: -1 });
  res.json(last || {});
});

app.listen(PORT, ()=>console.log(`Listening ${PORT}`));