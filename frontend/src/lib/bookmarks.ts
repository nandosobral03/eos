import axios from "axios"
import { environment } from "./environment"
import type { Bookmark } from "./models/ServerData"
import { bookmarks } from "./stores/stores"

const createBookmarkService = () => {
    const updateBookmark = async (bookmark: Bookmark) => {
        await axios.put(`${environment.api}/bookmarks/${bookmark.id}`, bookmark,{
            headers: {
                Authorization: `${localStorage.getItem("token")}`
            }
        })
        await getBookmarks()
    }
    const deleteBookmark = async (id: number) => {
        await axios.delete(`${environment.api}/bookmarks/${id}`,{
                headers: {
                    Authorization: `${localStorage.getItem("token")}`
                }
            })
        await getBookmarks()
    }

    const createBookmark = async (bookmark: Bookmark) => {
        await axios.post(`${environment.api}/bookmarks`, bookmark,{
            headers: {
                Authorization: `${localStorage.getItem("token")}`
            }
        })
        await getBookmarks()

    }
    
    const getBookmarks = async () => {
        const response = await axios.get(`${environment.api}/bookmarks`,{
            headers: {
                Authorization: `${localStorage.getItem("token")}`
            }
        })
        bookmarks.set(response.data)
    }
    
    return {
        updateBookmark,
        deleteBookmark,
        createBookmark,
    }
}

export const bookmarkService = createBookmarkService()