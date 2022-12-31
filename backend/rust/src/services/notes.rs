//CRUD for notes in sqlite

use rusqlite::{Connection, Error};

use crate::Note;

pub fn save_notes(notes: Note) -> Result<(), Error> {
    let conn = Connection::open("homescreen.db")?;
    conn.execute(
        "INSERT INTO notes (title, content, date) VALUES (?, ?, ?)",
        [notes.title, notes.content, notes.date],
    )?;
    Ok(())
}

pub fn get_notes() -> Result<Vec<Note>, Error> {
    let conn = Connection::open("homescreen.db")?;
    let mut stmt = conn.prepare("SELECT id,title, content, date FROM notes ORDER BY date DESC")?;
    let notes_iter = stmt.query_map([], |row| {
        Ok(Note {
            id: row.get(0)?,
            title: row.get(1)?,
            content: row.get(2)?,
            date: row.get(3)?,
        })
    })?;
    let mut notes = Vec::new();
    for note in notes_iter {
        notes.push(note.unwrap());
    }
    Ok(notes)
}

pub fn delete_notes(id: i32) -> Result<(), Error> {
    let conn = Connection::open("homescreen.db")?;
    conn.execute("DELETE FROM notes WHERE id = ?", [id])?;
    Ok(())
}

pub fn update_notes(id: i32, notes: Note) -> Result<(), Error> {
    let conn = Connection::open("homescreen.db")?;
    conn.execute(
        "UPDATE notes SET title = ?, content = ?, date = ? WHERE id = ?",
        [notes.title, notes.content, notes.date, id.to_string()],
    )?;
    Ok(())
}

