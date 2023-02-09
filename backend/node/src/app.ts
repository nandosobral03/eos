import express from 'express';
import rssRoutes from './routes/rss.routes';
import bookmarkRoutes from './routes/bookmarks.routes';
import noteRoutes from './routes/notes.routes';
import fileUpload from 'express-fileupload';
import spotifyRoutes from './routes/spotify.routes';
import trackerRoutes from './routes/tracker.routes';
import authRoutes from './routes/auth.routes';
import cors from 'cors';
import * as authentication from './middlewares/authentication.middleware';


const initialize = async () => {
    const app = express();
    app.use(express.json());
    app.use(cors());
    app.use(express.urlencoded({ extended: true }));
    app.use(fileUpload({
        createParentPath: true
    }));
    app.use('/static', express.static(__dirname + '/images'));
    app.use("/auth", authRoutes);
    app.use("/rss", authentication.verifyJWT, rssRoutes);
    app.use("/bookmarks",authentication.verifyJWT,  bookmarkRoutes);
    app.use("/notes",authentication.verifyJWT,  noteRoutes);
    app.use("/spotify", spotifyRoutes);
    app.use("/tracker", authentication.verifyJWT, trackerRoutes);
    app.listen(process.env.PORT, () => {
        console.log(`Example app listening on port ${process.env.PORT}!`);
        
    });
};

export default initialize;