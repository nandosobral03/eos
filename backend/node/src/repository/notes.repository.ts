import {init} from '../db';	
import {Note} from '../models/note.model';

export const getNotes = async () => {
    const db = await init();
    return await db.all('SELECT id, title, content, date FROM notes');
}

export const createNote = async (note: Note) => {
    const db = await init();
    const { lastID } = await db.run('INSERT INTO notes (title, content, date) VALUES (?, ?, ?)', [note.title, note.content, note.date]);
    return lastID;
}

export const updateNote = async (id:number, note: Note) => {
    const db = await init();
    await db.run('UPDATE notes SET title = ?, content = ?, date = ? WHERE id = ?', [note.title, note.content, note.date, id]);

}

export const deleteNote = async (id: number) => {
    const db = await init();
    await db.run('DELETE FROM notes WHERE id = ?', [id]);

}

export default { getNotes, createNote, updateNote, deleteNote };