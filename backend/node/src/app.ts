import express from 'express';
import rssRoutes from './routes/rss.routes';
import bookmarkRoutes from './routes/bookmarks.routes';
const initialize = async () => {
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use("/rss", rssRoutes);
    app.use("/bookmarks", bookmarkRoutes);

    app.listen(3000, () => {
        console.log('Example app listening on port 3000!');
    });

};

export default initialize;