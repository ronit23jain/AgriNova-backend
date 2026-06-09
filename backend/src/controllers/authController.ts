import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

import {
  createUserService,
  Gender,
  getUserByUsernameService,
  getUserByFarmRegNoService,
  getUserByIdService,
  UserRole,
} from "../models/authMODEL";

dotenv.config();

const handleResponse = (
  res: Response,
  status: number,
  message: string,
  data: any = null
) => {
  res.status(status).json({
    message,
    data,
  });
};

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    username,
    password,
    role,
    name,
    address,
    phone_no,
    gender,
    dob,
    farm_name,
    farmer_registration_no,
    alt_contact_no,
  } = req.body as {
    username: string;
    password: string;
    role: UserRole;
    name: string;
    address: string;
    phone_no: string;
    gender: Gender;
    dob: string;
    farm_name?: string;
    farmer_registration_no?: string;
    alt_contact_no?: string;
  };

  try {
    const existingUser =
      await getUserByUsernameService(username);

    if (existingUser) {
      return handleResponse(
        res,
        400,
        "Username already exists"
      );
    }

    if (
      role === "farmer" &&
      (!farm_name || !farmer_registration_no)
    ) {
      return handleResponse(
        res,
        400,
        "Farm name and registration number are required for farmers"
      );
    }

    const existingFarmer = await getUserByFarmRegNoService(
      req.body.farmer_registration_no
    );

    if (existingFarmer) {
      return res.status(400).json({
        message:
          "Farm registration number already exists",
        data: null,
      });
    }


    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const newUser = await createUserService({
      username,
      password: hashedPassword,
      role,
      name,
      address,
      phone_no,
      gender,
      dob: new Date(dob),
      farm_name: farm_name || null,
      farmer_registration_no:
        farmer_registration_no || null,
      alt_contact_no:
        alt_contact_no || null,
    });

    return handleResponse(
      res,
      201,
      "User registered successfully",
      newUser
    );
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body as {
    username: string;
    password: string;
  };

  try {
    const user =
      await getUserByUsernameService(username);

    if (!user) {
      return handleResponse(
        res,
        400,
        "Invalid username or password"
      );
    }

    const match = await bcrypt.compare(
      password,
      user.password || ""
    );

    if (!match) {
      return handleResponse(
        res,
        400,
        "Invalid username or password"
      );
    }

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d",
      }
    );

    return handleResponse(
      res,
      200,
      "Login successful",
      {
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          name: user.name,
        },
      }
    );
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await getUserByIdService(
      Number((req.user as any).userId)
    );

    if (!user) {
      return handleResponse(
        res,
        404,
        "User not found"
      );
    }

    return handleResponse(
      res,
      200,
      "User registered successfully",
      user
    );
  } catch (error) {
    next(error);
  }
};