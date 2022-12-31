import { Router } from "express";
import { getRSS , createRSS, deleteRSS, updateRSS } from "../controller/rss.controller"
const router = Router();

router.get("/", getRSS);
router.post("/", createRSS);
router.delete("/:id", deleteRSS);
router.put("/:id", updateRSS);

export default router;