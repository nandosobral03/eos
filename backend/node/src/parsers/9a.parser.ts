import { Tracked } from "../models/tracker.model";




export const parseUrl = (tracked:Tracked, current_url:string) =>{
    let [name,id] = current_url.split("/watch/")[1].split(".");
    tracked.title = name
    let episode = current_url.split("/watch/")[1].split("/")[1].split("-")[1];
    tracked.currentEpisode = parseInt(episode);
    let next_url = getUrl(current_url, tracked.currentEpisode);
    tracked.url = next_url;
}


export const getUrl = (oldUrl:string, currentEpisode:number) => {
    let next_url = `${oldUrl.substring(0, oldUrl.lastIndexOf("/") + 1)}ep-${currentEpisode+1}`;
    return next_url;
}

export const condition = (url:string) => {
    return url.includes("9anime");
}


export default {parseUrl, getUrl, condition}