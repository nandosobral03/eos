import axios from "axios"
import { environment } from "./environment"
import type { Note } from "./models/ServerData"
import { notes } from "./stores/stores"

const createNoteService = () => {
    const updateNote = async (note: Note) => {
        await axios.put(`${environment.api}/notes/${note.id}`, note)
        await getNotes()
    }
    const deleteNote = async (id: number) => {
        await axios.delete(`${environment.api}/notes/${id}`)
        await getNotes()

    }
    const createNote = async (note: Note) => {
        await axios.post(`${environment.api}/notes`, note)
        await getNotes()

    }
    
    const getNotes = async () => {
        const response = await axios.get(`${environment.api}/notes`)
        notes.set(response.data)
    }

    return {
        updateNote,
        deleteNote,
        createNote,
    }
}

export const noteService = createNoteService()