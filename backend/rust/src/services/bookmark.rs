

use rusqlite::{Connection, Result, Error};
use crate::{Bookmark, BookmarkLink};

pub fn save_bookmark(bookmark: Bookmark) -> Result<(), Error> {
    let conn = Connection::open("homescreen.db")?;
    conn.execute(
        "INSERT INTO bookmarks (name, color) VALUES (?1, ?2)",
        [bookmark.name.clone(), bookmark.color],
    )?;
    for link in bookmark.links {
        print!("{} {} {}", link.name, link.url, bookmark.name.clone());
        conn.execute(
            "INSERT INTO links (name, url, bookmark_id) VALUES (?1, ?2, ?3)",
            [link.name, link.url, bookmark.name.clone()],
        )?;
    }
    
    Ok(())
}

pub fn get_bookmarks() -> Result<Vec<Bookmark>, Error> {
    let conn = Connection::open("homescreen.db")?;
    // bring all the bookmarks and their links from the database
    let mut stmt = conn.prepare("SELECT name, color FROM bookmarks")?;
    let bookmark_iter = stmt.query_map([], |row| {
        Ok(Bookmark {
            name: row.get(0)?,
            color: row.get(1)?,
            links: Vec::new(),
        })
    })?;
    
    let mut bookmarks = Vec::new();
    for bookmark in bookmark_iter {
        let mut bookmark = bookmark.unwrap();
        let mut stmt = conn.prepare("SELECT name, url FROM links WHERE bookmark_id = ?")?;
        let link_iter = stmt.query_map([bookmark.name.clone()], |row| {
            Ok(BookmarkLink {
                name: row.get(0)?,
                url: row.get(1)?,
            })
        })?;
        let mut links = Vec::new();
        for link in link_iter {
            links.push(link.unwrap());
        }
        bookmark.links = links;
        bookmarks.push(bookmark);
    }

    Ok(bookmarks)
}


pub fn delete_bookmark(name: String) -> Result<(), Error> {
    let conn = Connection::open("homescreen.db")?;
    conn.execute(
        "DELETE FROM links WHERE bookmark_id = ?",
        [name.clone()],
    )?;
    conn.execute(
        "DELETE FROM bookmarks WHERE name = ?",
        [name.clone()],
    )?;
    Ok(())
}

pub fn update_bookmark(name: String, bookmark: Bookmark) -> Result<(), Error> {
    let conn = Connection::open("homescreen.db")?;
    //check if new name is already taken
    let mut stmt = conn.prepare("SELECT name FROM bookmarks WHERE name = ?")?;
    let bookmark_iter = stmt.query_map([bookmark.name.clone()], |row| {
        Ok(Bookmark {
            name: row.get(0)?,
            color: "".to_string(),
            links: Vec::new(),
        })
    })?;
    let mut bookmarks = Vec::new();
    for bookmark in bookmark_iter {
        bookmarks.push(bookmark?);
    }
    if bookmarks.len() > 0 {
        return Err(Error::InvalidQuery);
    }
    
    conn.execute(
        "DELETE FROM links WHERE bookmark_id = ?",
        [name.clone()],
    )?;

    conn.execute(
        "UPDATE bookmarks SET name = ?, color = ? WHERE name = ?",
        [bookmark.name.clone(), bookmark.color, name.clone()],
    )?;
   
    for link in bookmark.links {
        conn.execute(
            "INSERT INTO links (name, url, bookmark_id) VALUES (?1, ?2, ?3)",
            [link.name, link.url, bookmark.name.clone()],
        )?;
    }
    Ok(())
}