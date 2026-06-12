import axios from "axios";
import { Request, Response } from "express";

export const getCurrentWeather = async (
  req: Request,
  res: Response
) => {
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
};

export const getForecastWeather = async (
  req: Request,
  res: Response
) => {
  const { lat, lon } = req.query;

  const response = await axios.get(
    "https://api.openweathermap.org/data/2.5/forecast",
    {
      params: {
        lat,
        lon,
        units: "metric",
        cnt: 40,
        appid: process.env.OPENWEATHER_API_KEY,
      },
    }
  );

  res.json(response.data);
};