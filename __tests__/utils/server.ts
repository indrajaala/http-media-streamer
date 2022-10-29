import mediaStreamer from '../../src/main';
import express, { Application } from 'express';
const app: Application = express();
app.get('/', mediaStreamer);
const port = 3000;
const server = app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`);
});

export { app, server };
