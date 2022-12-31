mod services;
use std::str::FromStr;

use rocket::http::Status;
use rocket::response::status::{self, NotFound, Custom};
use rocket::{serde::json::Json};
use serde::{Deserialize, Serialize};
use rusqlite::{Connection};
use rocket_cors::{AllowedOrigins, CorsOptions, Method};
mod middleware;


#[macro_use] extern crate rocket;


#[derive(Serialize, Deserialize, Debug,  Clone)]
pub struct BookmarkLink {
    name: String,
    url: String,
}



#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Bookmark {
    name: String,
    color: String,
    links: Vec<BookmarkLink>,
}


#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Note {
    id: Option<i32>,
    title: String,
    content: String,
    date: String,
}


#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct RssFeed {
    id: Option<i32>,
    url: String,
    image: Option<String>,
}


//Bookmarks
#[post("/", data = "<category>")]
fn new_bookmark(category:Json<Bookmark>) -> Result<String, status::Custom<String>> {
    let bookmark = category.into_inner();
    match services::bookmark::save_bookmark(bookmark) {
        Ok(_) => Ok("Bookmark saved".to_string()),
        Err(e) => Err(Custom(Status::InternalServerError, e.to_string())),
    }
}


#[get("/")]
fn get_bookmarks() -> Result<Json<Vec<Bookmark>>, NotFound<String>>{
    match services::bookmark::get_bookmarks() {
        Ok(bookmarks) => Ok(Json(bookmarks)),
        Err(e) => Err(NotFound(e.to_string())),
    }
}

#[delete("/<name>")]
fn delete_bookmark(name: String) -> Result<String, NotFound<String>> {
    match services::bookmark::delete_bookmark(name) {
        Ok(_) => Ok("Bookmark deleted".to_string()),
        Err(e) => Err(NotFound(e.to_string())),
    }
}

#[put("/<name>", data = "<category>")]
fn update_bookmark(name: String, category: Json<Bookmark>) -> Result<String, NotFound<String>> {
    let bookmark = category.into_inner();
    match services::bookmark::update_bookmark(name, bookmark) {
        Ok(_) => Ok("Bookmark updated".to_string()),
        Err(e) => Err(NotFound(e.to_string())),
    }
}


//Notes
#[post("/", data = "<note>")]
fn new_notes(note:Json<Note>) -> Result<String, status::Custom<String>> {
    let note = note.into_inner();
    match services::notes::save_notes(note) {
        Ok(_) => Ok("Note saved".to_string()),
        Err(e) => Err(Custom(Status::InternalServerError, e.to_string())),
    }
}

#[get("/")]
fn get_notes() -> Result<Json<Vec<Note>>, NotFound<String>>{
    match services::notes::get_notes() {
        Ok(notes) => Ok(Json(notes)),
        Err(e) => Err(NotFound(e.to_string())),
    }
}

#[delete("/<id>")]
fn delete_notes(id: i32) -> Result<String, NotFound<String>> {
    match services::notes::delete_notes(id) {
        Ok(_) => Ok("Note deleted".to_string()),
        Err(e) => Err(NotFound(e.to_string())),
    }
}

#[put("/<id>", data = "<note>")]
fn update_notes(id: i32, note: Json<Note>) -> Result<String, NotFound<String>> {
    let note = note.into_inner();
    match services::notes::update_notes(id, note) {
        Ok(_) => Ok("Note updated".to_string()),
        Err(e) => Err(NotFound(e.to_string())),
    }
}

#[post("/", data = "<rss_feed>")]
fn new_rss_feed(rss_feed:Json<RssFeed>) -> Result<String, status::Custom<String>> {
    let rss_feed = rss_feed.into_inner();
    match services::rss_feed::save_rss_feed(rss_feed) {
        Ok(_) => Ok("Rss feed saved".to_string()),
        Err(e) => Err(Custom(Status::InternalServerError, e.to_string())),
    }
}

#[get("/")]
fn get_rss_feeds() -> Result<Json<Vec<RssFeed>>, NotFound<String>>{
    match services::rss_feed::get_rss_feed() {
        Ok(rss_feed) => Ok(Json(rss_feed)),
        Err(e) => Err(NotFound(e.to_string())),
    }
}

#[delete("/<id>")]
fn delete_rss_feed(id: i32) -> Result<String, NotFound<String>> {
    match services::rss_feed::delete_rss_feed(id) {
        Ok(_) => Ok("Rss feed deleted".to_string()),
        Err(e) => Err(NotFound(e.to_string())),
    }
}



#[launch]
fn rocket() -> _ {
    run_migrations();
    rocket::build()
    .attach(middleware::cors::Cors)
    .mount("/bookmarks", routes![new_bookmark,get_bookmarks,update_bookmark,delete_bookmark])
        .mount("/notes", routes![new_notes,get_notes,update_notes,delete_notes])
        .mount("/rss", routes![new_rss_feed,get_rss_feeds,delete_rss_feed])
    }


fn run_migrations(){
    let conn = Connection::open("homescreen.db");
    match conn {
        Ok(conn) => {
            conn.execute(
                "CREATE TABLE IF NOT EXISTS bookmarks (
                          name TEXT PRIMARY KEY,
                          color TEXT NOT NULL
                        )
                          
                          ",

                [],
            ).unwrap();
            conn.execute(
                "CREATE TABLE IF NOT EXISTS links (
                          id INTEGER PRIMARY KEY,
                          name TEXT NOT NULL,
                          url TEXT NOT NULL,
                          bookmark_id INTEGER NOT NULL,
                          FOREIGN KEY (bookmark_id) REFERENCES bookmarks (name)
                          )",
                [],
            ).unwrap();
            conn.execute(
                "CREATE TABLE IF NOT EXISTS notes (
                        id INTEGER PRIMARY KEY,
                        title TEXT NOT NULL,
                        content TEXT NOT NULL,
                        date  DATETIME DEFAULT CURRENT_TIMESTAMP

                        )",
                [],
            ).unwrap();
            conn.execute(
                "CREATE TABLE IF NOT EXISTS rss (
                        id INTEGER PRIMARY KEY,
                        url TEXT NOT NULL,
                        image TEXT NOT NULL
                        )",
                [],
            ).unwrap();
        }
        Err(e) => {
            println!("Error: {}", e);
        }
    }
}
