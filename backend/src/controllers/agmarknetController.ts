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
  } catch (error: any) {
  console.log(error.response?.data);
  console.log(error.response?.status);

  res.status(500).json({
    success: false,
    message: error.message,
  });
}
};