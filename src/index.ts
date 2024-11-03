import config from 'config'
import 'express-async-errors'
import App from "./app";
import mongoose from 'mongoose';
import DB from './utils/db';


const PORT = config.get<number>('port');

process.on("uncaughtException", (err: Error) => {
    console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
    // console.log(err.name, err.message);
    process.exit(1);
});


const server = App().listen(PORT, () => {
    console.log(`Application started successfully: ${PORT}`)
    DB.connect(console)
})


process.on("unhandledRejection", (err: Error) => {
    console.log("UNHANDLED REJECTION! 💥 Shutting down...");
    // console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

process.on("SIGTERM", () => {
    console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
    server.close(() => {
        console.log("💥 Process terminated!");
        process.exit(1);
    });
});

process.on("SIGINT", () => {
    console.log("👋 SIGINT RECEIVED. Shutting down gracefully");
    server.close(() => {
        console.log('redis shutdown')
        mongoose.disconnect().then(() => {
            console.error('db connection closed due to server termination');
            process.exit(0)
        })
    })
});