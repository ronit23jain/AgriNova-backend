import axios from "axios";
import { Request, Response } from "express";

export const getCurrentWeather = async (
  req: Request,
  res: Response
) => {
  try {
    const { lat, lon } = req.query;

    const response = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      {
        params: {
          lat,
          lon,
          units: "metric",
          appid: process.env.OPENWEATHER_API_KEY,
        },
      }
    );

    res.json(response.data);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};