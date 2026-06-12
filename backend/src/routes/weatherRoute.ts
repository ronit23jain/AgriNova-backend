import { Router } from "express";
import { getCurrentWeather } from "../controllers/weatherController";

const router = Router();

router.get("/current", getCurrentWeather);

export default router;