import sqlite3 from 'sqlite3'
import { open } from 'sqlite'


const init = async () => {
    const db = await open({
        filename: './homescreen.db',
        driver: sqlite3.cached.Database
    })
    await db.exec(`CREATE TABLE IF NOT EXISTS bookmarks (
        name TEXT PRIMARY KEY,
        color TEXT NOT NULL
        )`)
    await db.exec(`CREATE TABLE IF NOT EXISTS links (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        url TEXT NOT NULL,
        bookmark_id TEXT NOT NULL,
        FOREIGN KEY (bookmark_id) REFERENCES bookmarks (name)
        )`)
    await db.exec(`CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        date  DATETIME DEFAULT CURRENT_TIMESTAMP
        )`)
    await db.exec(`CREATE TABLE IF NOT EXISTS rss (
        id INTEGER PRIMARY KEY,
        url TEXT NOT NULL,
        image TEXT NOT NULL
        )`)
    return db
}


export default init