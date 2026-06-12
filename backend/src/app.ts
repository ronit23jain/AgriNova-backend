import express, { Request, Response, NextFunction } from 'express';

import multer from "multer";
import path from "path";
import fs from "fs";
import FormData from "form-data";

import dotenv from 'dotenv';
import pool from './config/database';
import errorHandling from './middleware/errorHandling';
import cors from 'cors';
import authRoute from './routes/authRoute';
import axios from 'axios';
import agmarknetRoute from "./routes/agmarknetRoute";
import weatherRoute from "./routes/weatherRoute";

dotenv.config();

const app = express();
const apiKey = process.env.AGMARKNET_API_KEY;
const port = process.env.PORT || 6090;

const upload = multer({ dest: 'uploads/' });

app.use(express.json());
app.use(cors());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoute);
app.use("/api/agmarknet", agmarknetRoute);
app.use("/api/weather", weatherRoute);
app.post('/predict', upload.single('file'), async (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const imagePath = path.resolve(req.file.path);

    try {
        const formData = new FormData();
        const fileStream = fs.createReadStream(imagePath);
        formData.append('image', fileStream);

        // Send POST request to Flask API for prediction
        const response = await axios.post(`${process.env.FLASK_CNN_URL}/predict`, formData, {
            headers: formData.getHeaders(),
        });

        fs.unlinkSync(imagePath);
        res.json(response.data);
    } catch (error: any) {
        fs.unlinkSync(imagePath);
        res.status(500).json({ error: error.message || 'An error occurred while processing the image' });
    }
});

// Fertilizer prediction endpoint
app.post("/predict_fertilizer", async (req: Request, res: Response) => {
    // Validate the request body
    const { crop, stage, soil_type, N, P, K, pH, organic_carbon, temp, rainfall } = req.body;

    if (!crop || !stage || !soil_type || !N || !P || !K || !pH || !organic_carbon || !temp || !rainfall) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        // Prepare data to send to Flask API
        const payload = {
            crop,
            stage,
            soil_type,
            N,
            P,
            K,
            pH,
            organic_carbon,
            temp,
            rainfall,
        };
        // Send POST request to Flask API for fertilizer prediction
        const response = await axios.post(`${process.env.FLASK_FERTILIZER_URL}/predict_fertilizer`, payload, {
            headers: { "Content-Type": "application/json" },
        });

        // Return the prediction result from Flask API
        res.json(response.data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});


app.use(errorHandling);

pool.connect().then(() => {
    console.log('Database connected PostgreSQL');
})
    .catch((err) => {
        console.error('Database connection error:', err);
    });
app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});