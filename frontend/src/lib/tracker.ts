import axios from "axios"
import { environment } from "./environment"
import { tracked } from "./stores/stores"
import type { TrackerForUpdate } from "./models/Tracker"

const createTrackedService = () => {
    const getTracked = async () => {
        const response = await axios.get(`${environment.api}/tracker`)
        tracked.set(response.data)
    }

    const search = async (title: string) => {
        const response = await axios.get(`https://api.jikan.moe/v4/anime?q=${title}&limit=10`);
        return response.data.data.map(
            (item: {
                mal_id: number;
                episodes: number;
                images: {
                    jpg: {
                        image_url: string;
                        small_image_url: string;
                        large_image_url: string;
                    }
                };
                status: string;
                titles: {
                    type: string;
                    title: string;
                }[]
            }) => {
                return {
                    id: item.mal_id,
                    totalEpisodes: item.episodes,
                    image: item.images.jpg?.image_url || item.images.jpg?.small_image_url || item.images.jpg?.large_image_url ,
                    status: item.status,
                    displayTitle: item.titles.find((t) => t.type.toLowerCase() == "default")?.title || item.titles.find((t) => t.type.toLowerCase() == "english")?.title,
                } as TrackerForUpdate
            }
        )
    }


    const updateId = async (title: string, id: number) => {
        await axios.put(`${environment.api}/tracker/${title}`, {
            newId: id,
        })
        await getTracked();
    }

    const updateCurrentEpisode = async (title: string, currentEpisode:number) => {
        await axios.put(`${environment.api}/tracker/${title}/episode`, {
            currentEpisode,
        });
        await getTracked();
    }


    const deleteTracked = async (title: string) => {
        await axios.delete(`${environment.api}/tracker/${title}`)
        await getTracked();
    }

    return {
       getTracked,
       search,
        updateId,
        updateCurrentEpisode,
        deleteTracked
    }
}

export const trackedService = createTrackedService()