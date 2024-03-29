import axios from "axios"
import { writable } from "svelte/store"
import { environment } from "./environment"
import type { RSSProvider } from "./models/ServerData"
import { rss } from "./stores/stores"

const createRSSStore = () => {
    const loading = writable(false)

    const fetchRSSProviders = async () => {
        loading.set(true)
        const response = await axios.get(
            `${environment.api}/rss`
            ,{
                headers: {
                    Authorization: `${localStorage.getItem("token")}`
                }
            })
        rss.set(response.data)
        loading.set(false)
    }

    const createRSSProvider = async (url: string) => {
        loading.set(true)
        const response = await axios.post(
            `${environment.api}/rss`,
            { url, image: "" }
            ,{
                headers: {
                    Authorization: `${localStorage.getItem("token")}`
                }
            })
        fetchRSSProviders();
        return response.data.id;
    }

    const deleteRSSProvider = async (id: number) => {
        loading.set(true)
        await axios.delete(`${environment.api}/rss/${id}`,{
            headers: {
                Authorization: `${localStorage.getItem("token")}`
            }
        })
        rss.update((rss) => rss.filter((r) => r.id !== id))
        loading.set(false)
    }

    const updateRSSProvider = async (provider: RSSProvider) => {
        loading.set(true)
        await axios.put(`${environment.api}/rss/${provider.id}`, provider,{
            headers: {
                Authorization: `${localStorage.getItem("token")}`
            }
        })
        await fetchRSSProviders();
    }

    const updateRSSProviderImage = async (id: number, imageFile: File) => {
        loading.set(true)
        const formData = new FormData();
        formData.append("image", imageFile);
        await axios.put(`${environment.api}/rss/${id}/image`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `${localStorage.getItem("token")}`
            }
        })
        await fetchRSSProviders();
    }


    const massCreateRSSProviders = async (urls: string[]) => {
        loading.set(true)
        const response = await axios.post(
            `${environment.api}/rss/mass`,
            urls
            ,{
                headers: {
                    Authorization: `${localStorage.getItem("token")}`
                }
            }
        )
        fetchRSSProviders();
        return response.data;
    }
    

    return {
        fetchRSSProviders,
        createRSSProvider,
        deleteRSSProvider,
        updateRSSProvider,
        updateRSSProviderImage,
        massCreateRSSProviders,
        loading,
    }

}

export const rssService = createRSSStore()