import express from 'express';
import rssRoutes from './routes/rss.routes';

const initialize = async () => {
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.get('/', (req, res) => {
        res.send('Hello World!');
    });

    app.use("/rss", rssRoutes);

    app.listen(3000, () => {
        console.log('Example app listening on port 3000!');
    });

};

export default initialize;