import axios from 'axios';
import { environment } from './environment';
import { writable } from 'svelte/store';

const createspotifyService = () => {

    const createTermWritable = (key:string, startValue:string) => {
        if(typeof localStorage === 'undefined') return writable(startValue)
        const value = localStorage.getItem(key) || startValue;
        const { subscribe, set } = writable(value);
        const original_set = set;
        return {
            subscribe,
            set: (value:string) => {
                localStorage.setItem(key, value);
                original_set(value);
            },
        };
    }

    const term = createTermWritable("term", "short_term")
    let _term: string;

    term.subscribe(value => {
        _term = value
    })

    const refreshAccessToken = async (refresh_token:string) => {
        const tokenData = await axios.get(
            `${environment.api}/spotify/refresh_token?refresh_token=${refresh_token}`
          )
           localStorage.setItem("access_token", tokenData.data.access_token);
           localStorage.setItem("expires_at", (new Date().getTime() + tokenData.data.expires_in * 1000).toString());
        }
    
    const getUserTopTracks = async () => {

        const cached = localStorage.getItem("top-tracks")
        if(cached) {
            const parsed = JSON.parse(cached)
            if(parsed[_term] && parsed[_term].expires_at > new Date().getTime()) {
                return parsed[_term].data
            }

        }

        const res = await axios.get(
            `${environment.api}/spotify/top-tracks?term=${_term}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`
            }}
        )

        if(cached) {
            const parsed = JSON.parse(cached)
            parsed[_term] = {
                expires_at: new Date().getTime() + 1000 * 60 * 60,
                data: res.data
            }
            localStorage.setItem("top-tracks", JSON.stringify(parsed))
        } else {
            localStorage.setItem("top-tracks", JSON.stringify({
                [_term]: {
                    expires_at: new Date().getTime() + 1000 * 60 * 60 * 24,
                    data: res.data
                }
            }))
        }



        return res.data
    }

    const getUserTopArtists = async () => {

        const cached = localStorage.getItem("top-artists")
        if(cached) {
            const parsed = JSON.parse(cached)
            if(parsed[_term] && parsed[_term].expires_at > new Date().getTime()) {
                return parsed[_term].data
            }
        }



        const res = await axios.get(
            `${environment.api}/spotify/top-artists?term=${_term}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`
            }}
        )


        if(cached) {
            const parsed = JSON.parse(cached)
            parsed[_term] = {
                expires_at: new Date().getTime() + 1000 * 60 * 60,
                data: res.data
            }
            localStorage.setItem("top-artists", JSON.stringify(parsed))
        } else {
            localStorage.setItem("top-artists", JSON.stringify({
                [_term]: {
                    expires_at: new Date().getTime() + 1000 * 60 * 60 * 24,
                    data: res.data
                }
            }))
        }


        return res.data
    }

    const getCurrentlyPlaying = async () => {
        const res = await axios.get(
            `${environment.api}/spotify/currently-playing`, 
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`
            }}
        )
        return res.data
    }

    const startPlayback = async () => {
        const res = await axios.put(
            `${environment.api}/spotify/start-playback`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`
                },
                params: {
                    authorization: `Bearer ${localStorage.getItem("access_token")}`
                }
        
        }
        )
        return res.data
    }

    const pausePlayback = async () => {
        const res = await axios.put(
            `${environment.api}/spotify/pause-playback`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`
            },
            params: {
                authorization: `Bearer ${localStorage.getItem("access_token")}`
            }
        }
        )
        return res.data
    }

    const skipToNext = async () => {
        const res = await axios.put(
            `${environment.api}/spotify/next-track`,
            {},
            {   
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`
            }}
        )
        return res.data
    }

    const skipToPrevious = async () => {
        const res = await axios.put(
            `${environment.api}/spotify/previous-track`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`
        
                },
                params: {
                    authorization: `Bearer ${localStorage.getItem("access_token")}`
                }
        
        }
        )
        return res.data
    }



    return {
        refreshAccessToken,
        getUserTopTracks,
        getUserTopArtists,
        getCurrentlyPlaying,
        startPlayback,
        pausePlayback,
        skipToNext,
        skipToPrevious,
        term
    }
}

export const spotifyService = createspotifyService()