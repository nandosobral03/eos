
import { environment } from '$lib/environment.server';
import axios from 'axios';
import path from 'path';
import fs from 'fs';

export const load = async (data:{url:URL}) => {
    const login = await axios.post(`${environment.api}/auth`,
    {
        password: "eostitanofdawnanddawnitselfasitcomesdownontohumans",
    });

    const {token} = login.data;
    
    try{
        const results = await Promise.all([
            getRssLinks(token),
            getBookmarks(token),
            getNotes(token),
            getTracked(token),
            getBackground()
        ])
        const access_token = data.url.searchParams.get("access_token")
        const refresh_token = data.url.searchParams.get("refresh_token")
        const expires_in = data.url.searchParams.get("expires_in")
        data.url.searchParams.delete("access_token")
        data.url.searchParams.delete("refresh_token")
        data.url.searchParams.delete("expires_in")
        return {
            rss: results[0],
            bookmarks: results[1],
            notes: results[2],
            tracked: results[3],
            access_token,
            refresh_token,
            expires_in,
            background_url: results[4]
        }
    }
    catch(error){
       return {
            rss: [],
            bookmarks: [],
            notes: [],
            tracked: [],
       }
    }
    
};

const getRssLinks = async (token:string) => {
    const response = await axios.get(`${environment.api}/rss`,{
        headers: {
            Authorization: `${token}`
        }
    });
    return response.data;
}


const getBookmarks = async (token:string) => {
    const response = await axios.get(`${environment.api}/bookmarks`,{
        headers: {
            Authorization: `${token}`
        }
    });
    return response.data;
}

const getNotes = async (token:string) => {
    const response = await axios.get(`${environment.api}/notes`,{
        headers: {
            Authorization: `${token}`
        }
    });
    return response.data;
}

const getTracked = async (token:string) => {
    const response = await axios.get(`${environment.api}/tracker`,{
        headers: {
            Authorization: `${token}`
        }
    });
    return response.data;
}

const getBackground = async () => {
    const imageDir = path.join(process.cwd(), "static", "images","compressed");
    const files = fs.readdirSync(imageDir);
    const backgroundFile = files.filter(file => file.startsWith("background."));
    if(backgroundFile.length === 0){
        return new Response("No background image found",{ status: 404 })
    }
    const imagePath = path.join(imageDir, backgroundFile[0]);
    const image = fs.readFileSync(imagePath);
    const imageType = backgroundFile[0].split(".")[1];
    return `data:image/${imageType};base64,${image.toString("base64")}`;
}