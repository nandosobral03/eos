import axios from 'axios';
import { environment } from './environment';

const createspotifyService = () => {
    const refreshAccessToken = async (refresh_token:string) => {
        const tokenData = await axios.get(
            `${environment.api}/spotify/refresh_token?refresh_token=${refresh_token}`
          )
           localStorage.setItem("access_token", tokenData.data.access_token);
           localStorage.setItem("expires_at", (new Date().getTime() + tokenData.data.expires_in * 1000).toString());
        }
    
    const getUserTopTracks = async (term:"short_term"| "medium_term" | "long_term") => {

        const cached = localStorage.getItem("top-tracks")
        if(cached) {
            const parsed = JSON.parse(cached)
            if(parsed[term] && parsed[term].expires_at > new Date().getTime()) {
                return parsed[term].data
            }
        }

        const res = await axios.get(
            `${environment.api}/spotify/top-tracks?term=${term}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`
            }}
        )

        if(cached) {
            const parsed = JSON.parse(cached)
            parsed[term] = {
                expires_at: new Date().getTime() + 1000 * 60 * 60,
                data: res.data
            }
            localStorage.setItem("top-tracks", JSON.stringify(parsed))
        } else {
            localStorage.setItem("top-tracks", JSON.stringify({
                [term]: {
                    expires_at: new Date().getTime() + 1000 * 60 * 60 * 24,
                    data: res.data
                }
            }))
        }



        return res.data
    }

    const getUserTopArtists = async (term:"short_term"| "medium_term" | "long_term") => {

        const cached = localStorage.getItem("top-artists")
        if(cached) {
            const parsed = JSON.parse(cached)
            if(parsed[term] && parsed[term].expires_at > new Date().getTime()) {
                return parsed[term].data
            }
        }



        const res = await axios.get(
            `${environment.api}/spotify/top-artists?term=${term}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`
            }}
        )


        if(cached) {
            const parsed = JSON.parse(cached)
            parsed[term] = {
                expires_at: new Date().getTime() + 1000 * 60 * 60,
                data: res.data
            }
            localStorage.setItem("top-artists", JSON.stringify(parsed))
        } else {
            localStorage.setItem("top-artists", JSON.stringify({
                [term]: {
                    expires_at: new Date().getTime() + 1000 * 60 * 60 * 24,
                    data: res.data
                }
            }))
        }


        return res.data
    }

    return {
        refreshAccessToken,
        getUserTopTracks,
        getUserTopArtists
    }
}

export const spotifyService = createspotifyService()