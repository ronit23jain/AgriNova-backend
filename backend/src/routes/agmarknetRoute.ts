import { Router } from "express";
import { getCommodities } from "../controllers/agmarknetController";

const router = Router();

router.get("/commodities", getCommodities);

export default router;