import { environment } from '$lib/environment';
import axios from 'axios';

export const load = async () => {
    try{
        const results = await Promise.all([
            getRssLinks(),
            getBookmarks(),
            getNotes()
        ])
        return {
            rss: results[0],
            bookmarks: results[1],
            notes: results[2]
        }
    }
    catch(error){
       return {
            rss: [],
            bookmarks: [],
            notes: []
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