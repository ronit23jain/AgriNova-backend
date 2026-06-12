import { Router } from "express";
import {
    getCommodities,
    getGeographies,
} from "../controllers/agmarknetController";

const router = Router();

router.get("/commodities", getCommodities);
router.get("/geographies", getGeographies);
export default router;