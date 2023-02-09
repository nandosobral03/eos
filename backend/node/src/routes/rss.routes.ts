import { Router } from "express";
import { getRSS , createRSS, deleteRSS, updateRSS, updateRSSImage, createMassRSS } from "../controller/rss.controller"
const router = Router();

router.get("/", getRSS);
router.post("/", createRSS);
router.post("/mass", createMassRSS);
router.delete("/:id", deleteRSS);
router.put("/:id", updateRSS);
router.put("/:id/image", updateRSSImage);

export default router;