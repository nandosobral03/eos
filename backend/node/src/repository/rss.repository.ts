import { RSS } from "../models/rss.model"
import {init} from "../db"
import fs from "fs";
import path from "path";

export const getRSS = async () => {
    const db = await init();
    const rss = await db.all("SELECT id, url, image FROM rss") as RSS[];
    return rss;
}

export const createRSS = async (rss:RSS) => {
    const db = await init();
    try{
        const { lastID } = await db.run("INSERT INTO rss (url, image) VALUES (?, ?)", rss.url, rss.image);
        return lastID;
    }
    catch(e){
        throw {
            status: 400,
            message: "Error creating RSS"
        }
    }
}

export const deleteRSS = async (id:number) => {
    const db = await init();
    await db.run("DELETE FROM rss WHERE id = ?", id);
}

export const updateRSS = async (id:number, rss:RSS) => {
    const db = await init();
    try {
        await db.run("UPDATE rss SET url = ?, image = ? WHERE id = ?", rss.url, rss.image, id);
    } catch (e) {
        throw {
            status: 400,
            message: "Error updating RSS"
        }
    }
}

export const updateRSSImage = async (id:number, image: { data: Buffer, name: string, size: number, mimetype: string, md5: string }) => {
    let ext = path.extname(image.name);
    let filename = `${id}${ext}`;
    let filepath = path.join(__dirname, "..", "images", filename);
    await fs.writeFileSync(filepath, image.data);
    const db = await init();
    try {
        await db.run("UPDATE rss SET image = ? WHERE id = ?", `http://localhost:3000/static/${filename}`, id);
    } catch (e) {
        throw {
            status: 400,
            message: "Error updating RSS"
        }
    }
}

    

export default {
    getRSS,
    createRSS,
    deleteRSS,
    updateRSS,
    updateRSSImage,
}