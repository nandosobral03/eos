import { handleHTTPError } from '../models/error.model';
import { Tracked } from '../models/tracker.model';
import parser from '../parsers/9a.parser';
import repo from '../repository/tracker.repository';
import axios from 'axios';
import {Request, Response} from 'express';

export const getTracked = async (req: Request, res: Response) => {
    try{
        let episodes = await repo.getTracked();
        res.send(episodes);
    } catch (error) {
        let err = handleHTTPError(error);
        res.status(err.status).send(err.message);
    }
}


export const addTracked = async (req: Request, res: Response) => {
    let {current_url, currentEpisode, title} = req.body;
    let tracked:Tracked = {
        title: title,
        currentEpisode : currentEpisode,
        image: `${process.env.URL}/static/default.png`,
    }

    //Parsers set next_url and can modify the object
    try{
        if(current_url.includes("9anime")){
            parser.parseUrl(tracked, current_url);
        }
    }
    catch{
        res.status(400).send("Error parsing url");
        return;
    }

    tracked.displayTitle = tracked.title.replace(/-/g, " ").split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    
    try{
        const moreInfo = await axios.get(
            `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(tracked.title)}&limit=1`
        )
        if(moreInfo.data.data.length === 0){
        }

        const anime = moreInfo.data.data[0];
        tracked.id = anime.mal_id;
        tracked.displayTitle = anime.title_english ? anime.title_english : anime.title; 
        tracked.image = anime.images.jpg.image_url ? anime.images.jpg.image_url : anime.imges.webp.image_url ? anime.images.webp.image_url : `${process.env.URL}/static/default.png`;
        tracked.status = anime.airing ? "Airing" : "Finished";
        tracked.totalEpisodes = anime.airing ? null : anime.episodes;

        if(tracked.status === "Finished" && tracked.currentEpisode > anime.totalEpisodes){
            tracked.url = undefined;
        }

    }
    catch (error) {
        let err = handleHTTPError(error);
        res.status(err.status).send(err.message);
        return;
    }

    const alreadyInDb = await repo.getTrackedByTitle(tracked.title);
    if(alreadyInDb){
        if(alreadyInDb.totalEpisodes && alreadyInDb.currentEpisode >= alreadyInDb.totalEpisodes){
            await repo.updateTrackedEpisode(alreadyInDb.id!, tracked.currentEpisode);
        }else{
            await repo.updateTrackedEpisode(alreadyInDb.id!, tracked.currentEpisode, tracked.url!);
        }
        res.send("Updated");
        return;
    }

    await repo.addTracked(tracked);
    res.send("Added");
}



export const deleteTracked = async (req: Request, res: Response) => {
    let {id} = req.params;
    try{
        await repo.deleteTracked(parseInt(id));
    }
    catch (error) {
        let err = handleHTTPError(error);
        res.status(err.status).send(err.message);
        return;
    }
    res.send("Deleted");
}


export const updateTrackedEpisode = async (req: Request, res: Response) => {
    const id = req.params.id;
    const currentEpisode = req.body.currentEpisode;
    if(!id || !currentEpisode){
        res.status(400).send("Missing id or current episode");
        return;
    }
    try{
       const alreadyInDb = await repo.getTrackedById(parseInt(id));
       if(!alreadyInDb){
            res.status(404).send("Not found");
            return;
       }
       if(parser.condition(alreadyInDb.url!)){
            const newUrl = parser.getUrl(alreadyInDb.url!, currentEpisode);
        if(alreadyInDb){
                if(alreadyInDb.totalEpisodes && alreadyInDb.currentEpisode >= alreadyInDb.totalEpisodes){
                    await repo.updateTrackedEpisode(alreadyInDb.id!, currentEpisode);
                }else{
                    await repo.updateTrackedEpisode(alreadyInDb.id!, currentEpisode, newUrl);
                }
                res.send("Updated");
                return;
            }
        }
        else{
            res.status(400).send("Error parsing url");
            return;
        }
    }
    catch (error) {
        let err = handleHTTPError(error);
        res.status(err.status).send(err.message);
        return;
    }
}



export const updateTrackedId = async (req: Request, res: Response) => {
    const title = req.params.title;
    const newId = req.body.newId;
    if(!title || !newId){
        res.status(400).send("Missing id or new id");
        return;
    }

    let tracked = await repo.getTrackedByTitle(title);
    if(!tracked){
        res.status(404).send("Not found");
        return;
    }

    try{
        const moreInfo = await axios.get(
            `https://api.jikan.moe/v4/anime/${newId}`
        )
        if(moreInfo.data.data.length === 0){
        }

        const anime = moreInfo.data.data;
        tracked.id = anime.mal_id;
        tracked.displayTitle = anime.title_english ? anime.title_english : anime.title; 
        tracked.image = anime.images.jpg.image_url ? anime.images.jpg.image_url : anime.imges.webp.image_url ? anime.images.webp.image_url : `${process.env.URL}/static/default.png`;
        tracked.status = anime.airing ? "Airing" : "Finished";
        tracked.totalEpisodes = anime.airing ? null : anime.episodes;

        if(tracked.status === "Finished" && tracked.currentEpisode > anime.totalEpisodes){
            tracked.url = undefined;
        }

        await repo.updateTrackedId(title, tracked);
        res.send("Updated");
    }
    catch (error) {
        let err = handleHTTPError(error);
        res.status(err.status).send(err.message);
        return;
    }
}





export default {getTracked, addTracked, deleteTracked, updateTrackedEpisode, updateTrackedId}