import { Bookmark, BookmarkLink } from "../models/bookmark.model";
import {init} from "../db"

export const getBookmarks = async () => {
    const db = await init();
    const bookmarks = await db.all("SELECT id, title, color FROM bookmarks") as Bookmark[];
    for (let bookmark of bookmarks) {
        bookmark.links = await db.all("SELECT id, name, url FROM links WHERE bookmark_id = ?", bookmark.id) as BookmarkLink[];
    }
    return bookmarks;
}

export const createBookmark = async (bookmark:Bookmark) => {
    const db = await init();
    try{
        const { lastID } = await db.run("INSERT INTO bookmarks (title, color) VALUES (?, ?)", bookmark.title, bookmark.color);
        for (let link of bookmark.links) {
            await db.run("INSERT INTO links (name, url, bookmark_id) VALUES (?, ?, ?)", link.name, link.url, lastID);
        }
        return lastID;
    }
    catch(e){
        console.log(e)
        throw {
            status: 400,
            message: "Error creating bookmark"
        }
    }
}

export const deleteBookmark = async (id:number) => {
    const db = await init();
    await db.run("DELETE FROM bookmarks WHERE id = ?", id);
    await db.run("DELETE FROM links WHERE bookmark_id = ?", id);
}

export const updateBookmark = async (id:number, bookmark:Bookmark) => {
    const db = await init();
    try {
        await db.run("UPDATE bookmarks SET title = ?, color = ? WHERE id = ?", bookmark.title, bookmark.color, id);
        await db.run("DELETE FROM links WHERE bookmark_id = ?", id);
        for (let link of bookmark.links) {
            await db.run("INSERT INTO links (name, url, bookmark_id) VALUES (?, ?, ?)", link.name, link.url, id);
        }
    }
    catch(e){
        throw {
            status: 400,
            message: "Error updating bookmark"
        }
    }
}
export default { getBookmarks, createBookmark, deleteBookmark, updateBookmark }