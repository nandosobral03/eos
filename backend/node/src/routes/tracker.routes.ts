import { Router } from "express";
import { addTracked, deleteTracked, getTracked, updateTrackedEpisode, updateTrackedId } from "../controller/tracker.controller";
const router = Router();


router.get("/", getTracked);
router.post("/", addTracked);
router.delete("/:id", deleteTracked);
router.put("/:id/episode", updateTrackedEpisode);
router.put("/:title", updateTrackedId);

export default router;