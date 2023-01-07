import { Router } from "express";
import { getBookmarks, createBookmark, deleteBookmark, updateBookmark } from "../controller/bookmarks.controller"
const router = Router();

router.get("/", getBookmarks);
router.post("/", createBookmark);
router.delete("/:id", deleteBookmark);
router.put("/:id", updateBookmark);

export default router;