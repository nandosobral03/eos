import express from 'express';
import rssRoutes from './routes/rss.routes';
import bookmarkRoutes from './routes/bookmarks.routes';
import noteRoutes from './routes/notes.routes';
import fileUpload from 'express-fileupload';
import spotifyRoutes from './routes/spotify.routes';
import cors from 'cors';



const initialize = async () => {
    const app = express();
    app.use(express.json());
    app.use(cors());
    app.use(express.urlencoded({ extended: true }));
    app.use(fileUpload({
        createParentPath: true
    }));
    app.use('/static', express.static(__dirname + '/images'));
    
    app.use("/rss", rssRoutes);
    app.use("/bookmarks", bookmarkRoutes);
    app.use("/notes", noteRoutes);
    app.use("/spotify", spotifyRoutes);
    app.listen(process.env.port, () => {
        console.log('Example app listening on port 3000!');
        
    });

};

export default initialize;