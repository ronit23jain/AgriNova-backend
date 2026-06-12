import { Router } from "express";
import {
    getCommodities,
    getGeographies,
    getMarkets,
    getPrices,
} from "../controllers/agmarknetController";

const router = Router();

router.get("/commodities", getCommodities);
router.get("/geographies", getGeographies);
router.post("/markets", getMarkets);
router.post("/prices", getPrices);
export default router;