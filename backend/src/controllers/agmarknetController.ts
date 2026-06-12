import axios from "axios";
import { Request, Response } from "express";

export const getCommodities = async (
  req: Request,
  res: Response
) => {
  try {
    const response = await axios.get(
      "https://api.ceda.ashoka.edu.in/v1/agmarknet/commodities",
      {
        headers: {
          Authorization: `Bearer ${process.env.AGMARKNET_API_KEY}`,
          Accept: "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch commodities",
    });
  }
};

export const getGeographies = async (
  req: Request,
  res: Response
) => {
  try {
    const response = await axios.get(
      "https://api.ceda.ashoka.edu.in/v1/agmarknet/geographies",
      {
        headers: {
          Authorization: `Bearer ${process.env.AGMARKNET_API_KEY}`,
          Accept: "application/json",
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