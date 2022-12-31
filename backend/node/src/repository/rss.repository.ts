import { RSS } from "../models/RSS.model"
import init from "../db"
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



export default {
    getRSS,
    createRSS,
    deleteRSS,
    updateRSS
}