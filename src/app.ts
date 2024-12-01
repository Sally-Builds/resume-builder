import path from 'path'
import express from 'express'
import dotenv from 'dotenv';
import cors from 'cors'
import { errorHandler } from './middlewares/errorHandler.middleware.js';
import routes from './routes.js';
import 'express-async-errors'
import { createBullBoard } from "@bull-board/api";
import { BullAdapter } from "@bull-board/api/bullAdapter.js";
import { ExpressAdapter } from "@bull-board/express";
import Queue from 'bull'
import { QueueNames } from './utils/bullMQ.js';
import config from './../config/default.js'

dotenv.config()

const redisOptions = {
    redis: {
        port: config['redisPort'],
        host: config['redisHost'],
        username: config['redisUsername'],
    }
}


const App = () => {
    const app = express();
    app.use(cors())
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static('public'));


    const queuesList = [...Object.values(QueueNames)];

    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath("/admin/queues");

    const queues = queuesList
        .map((qs) => new Queue(qs, redisOptions))
        .map((q) => new BullAdapter(q));
    const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
        queues,
        serverAdapter: serverAdapter,
    });


    app.use("/admin/queues", serverAdapter.getRouter());
    //routes go here
    routes(app)
    // Serve the HTML form
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });

    app.use('*', (req, res, next) => {
        res.status(404).json({ message: "Notfound" })
    })

    app.use(errorHandler)
    return app
}

export default App

