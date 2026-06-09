import pool from "../config/database";

export type UserRole = "farmer" | "customer";
export type Gender = "male" | "female" | "other";

export interface User {
  id: number;
  username: string;
  password: string;
  role: UserRole;
  name: string;
  address: string;
  phone_no: string;
  gender: Gender;
  dob: Date;
  farm_name?: string | null;
  farmer_registration_no?: string | null;
  alt_contact_no?: string | null;
  created_at?: Date;
  updated_at?: Date;
}

// Create User
export const createUserService = async (
  user: Omit<User, "id" | "created_at" | "updated_at">
): Promise<User> => {
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
  } = user;

  const result = await pool.query(
    `
    INSERT INTO users
    (
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
      alt_contact_no
    )
    VALUES
    ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
    RETURNING *
    `,
    [
      username,
      password,
      role,
      name,
      address,
      phone_no,
      gender,
      dob,
      role === "farmer" ? farm_name : null,
      role === "farmer" ? farmer_registration_no : null,
      alt_contact_no || null,
    ]
  );

  return result.rows[0];
};

// Get User by Username
export const getUserByUsernameService = async (
  username: string
): Promise<User | null> => {
  const result = await pool.query<User>(
    `SELECT * FROM users WHERE username = $1`,
    [username]
  );

  return result.rows[0] || null;
};

export const getUserByFarmRegNoService = async (
  farmRegNo: string
): Promise<User | null> => {

  const result = await pool.query<User>(
    `SELECT * FROM users
     WHERE farmer_registration_no = $1`,
    [farmRegNo]
  );

  return result.rows[0] || null;
};

// Get User by ID
export const getUserByIdService = async (
  id: number
): Promise<User | null> => {
  console.log("Searching ID =", id);

  const result = await pool.query(
    `SELECT * FROM users WHERE id = $1`,
    [id]
  );

  return result.rows[0] || null;
};