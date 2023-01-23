import { environment } from '$lib/environment';
import axios from 'axios';

export const load = async (data:{url:any}) => {
    try{
        const results = await Promise.all([
            getRssLinks(),
            getBookmarks(),
            getNotes(),
            getTracked()
        ])
        const access_token = data.url.searchParams.get("access_token")
        const refresh_token = data.url.searchParams.get("refresh_token")
        const expires_in = data.url.searchParams.get("expires_in")
        data.url.searchParams.delete("access_token")
        data.url.searchParams.delete("refresh_token")
        data.url.searchParams.delete("expires_in")
        console.log("access_token", access_token)
        return {
            rss: results[0],
            bookmarks: results[1],
            notes: results[2],
            tracked: results[3],
            access_token,
            refresh_token,
            expires_in
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

const getRssLinks = async () => {
    const response = await axios.get(`${environment.api}/rss`);
    return response.data;
}


const getBookmarks = async () => {
    const response = await axios.get(`${environment.api}/bookmarks`);
    return response.data;
}

const getNotes = async () => {
    const response = await axios.get(`${environment.api}/notes`);
    return response.data;
}

const getTracked = async () => {
    const response = await axios.get(`${environment.api}/tracker`);
    return response.data;
}