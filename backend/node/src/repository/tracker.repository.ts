import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript";
import { init } from "../db";
import { Tracked } from "../models/tracker.model";

const getTracked = async () => {
    const db = await init();
    const tracked = await db.all(
        `
        SELECT id, title, displayTitle, currentEpisode, totalEpisodes, url, image, status
        FROM tracked
        `
    ) as Tracked[];
    return tracked;
}

const addTracked = async (tracked: Tracked) => {
    const db = await init();
    console.log(tracked);
    console.log( tracked.id, tracked.title , tracked.displayTitle, tracked.currentEpisode, tracked.totalEpisodes, tracked.url, tracked.image, tracked.status)
    if(tracked.id){
        const usingId = await db.run(
            `
            INSERT INTO tracked (id, title, displayTitle, currentEpisode, totalEpisodes, url, image, status)
            VALUES (?, ?, ?, ?, ?, ?, ?,?)
            `,
            tracked.id, tracked.title, tracked.displayTitle, tracked.currentEpisode, tracked.totalEpisodes, tracked.url, tracked.image, tracked.status
        );
        
        return usingId;
    }
    const newTracked = await db.run(
        `
        INSERT INTO tracked (title, displayTitle, currentEpisode, totalEpisodes, url, image, status)
        VALUES (?, ?, ?, ?, ?, ?,?)
        `,
        tracked.title, tracked.displayTitle, tracked.currentEpisode, tracked.totalEpisodes, tracked.url, tracked.image, tracked.status
    );
    return newTracked;
}


const updateTrackedEpisode = async (id: number, currentEpisode: number, url?: string) => {
    const db = await init();
    const updatedTracked = await db.run(
        `
        UPDATE tracked 
        SET currentEpisode = ?, url = ?
        WHERE id = ?
        `,
        currentEpisode, url?url:null , id
    );
    return updatedTracked;
}

const getTrackedByTitle = async (title: string) => {
    const db = await init();
    const tracked = await db.all(
        `
        SELECT id, title, currentEpisode, totalEpisodes, url, image, status
        FROM tracked
        WHERE title = ?
        `,
        title
    ) as Tracked[];
    if(tracked.length === 0){
        return null;
    }else{
        return tracked[0];
    }
}

const getTrackedById = async (id: number) => {
    const db = await init();
    const tracked = await db.all(
        `
        SELECT id, title, currentEpisode, totalEpisodes, url, image, status
        FROM tracked
        WHERE id = ?
        `,
        id
    ) as Tracked[];
    if(tracked.length === 0){
        return null;
    }else{
        return tracked[0];
    }
}



const deleteTracked = async (id: number) => {
    const db = await init();
    const deletedTracked = await db.run(
        `
        DELETE FROM tracked
        WHERE id = ?
        `,
        id
    );
    return deletedTracked;
}



const updateTrackedId = async (title: string, tracker:Tracked) => {
    const db = await init();
    const updatedTracked = await db.run(
        `
        UPDATE tracked 
        SET id = ?, displayTitle = ?, totalEpisodes = ?, image = ?, status = ?
        WHERE title = ?
        `,
        tracker.id, tracker.displayTitle,  tracker.totalEpisodes, tracker.image, tracker.status, title
    );
    return updatedTracked;

}

export default {getTracked, addTracked,
     updateTrackedEpisode, getTrackedByTitle, getTrackedById
    , deleteTracked, updateTrackedId
    }