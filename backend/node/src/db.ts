import sqlite3 from 'sqlite3'
import { open } from 'sqlite'


export const runMigrations = async () => {
    const db = await open({
        filename: './homescreen.db',
        driver: sqlite3.cached.Database
    })
    await db.exec(`CREATE TABLE IF NOT EXISTS bookmarks (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        color TEXT NOT NULL
        )`)
    await db.exec(`CREATE TABLE IF NOT EXISTS links (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        url TEXT NOT NULL,
        bookmark_id TEXT NOT NULL,
        FOREIGN KEY (bookmark_id) REFERENCES bookmarks (id)
        )`)
    await db.exec(`CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        date  DATETIME DEFAULT CURRENT_TIMESTAMP
        )`)
    await db.exec(`CREATE TABLE IF NOT EXISTS rss (
        id INTEGER PRIMARY KEY,
        url TEXT UNIQUE NOT NULL,
        image TEXT NOT NULL
        )`)
    await db.exec(`CREATE TABLE IF NOT EXISTS tracked (
        id INTEGER NOT NULL,
        title TEXT PRIMARY KEY NOT NULL,
        displayTitle TEXT NOT NULL,
        currentEpisode INTEGER NOT NULL,
        totalEpisodes INTEGER,
        url TEXT,
        image TEXT NOT NULL,
        status TEXT NOT NULL
    )`)
    return db
}

export const init = async () => {
    const db = await open({
        filename: './homescreen.db',
        driver: sqlite3.cached.Database
    })
    return db
}


export default {runMigrations, init}