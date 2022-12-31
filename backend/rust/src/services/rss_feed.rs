// CRUD for RSS feeds in sqlite

use rusqlite::{Connection, Error};

use crate::RssFeed;

pub fn save_rss_feed(rss_feed: RssFeed) -> Result<(), Error> {
    let conn = Connection::open("homescreen.db")?;
    conn.execute(
        "INSERT INTO rss (url, image) VALUES (?, ?)",
        [rss_feed.url, rss_feed.image.unwrap_or("".to_string())],
        
    )?;
    Ok(())
}

pub fn get_rss_feed() -> Result<Vec<RssFeed>, Error> {
    let conn = Connection::open("homescreen.db")?;
    let mut stmt = conn.prepare("SELECT id, url, image FROM rss")?;
    let rss_feed_iter = stmt.query_map([], |row| {
        Ok(RssFeed {
            id: row.get(0)?,
            url: row.get(1)?,
            image: row.get(2)?,
        })
    })?;
    let mut rss_feed = Vec::new();
    for rss in rss_feed_iter {
        rss_feed.push(rss.unwrap());
    }
    Ok(rss_feed)
}

pub fn delete_rss_feed(id: i32) -> Result<(), Error> {
    let conn = Connection::open("homescreen.db")?;
    conn.execute("DELETE FROM rss WHERE id = ?", [id])?;
    Ok(())
}
