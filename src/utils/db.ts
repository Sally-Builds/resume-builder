import mongoose from 'mongoose';
import dotenv from 'dotenv';
import config from 'config'

dotenv.config();

const dbUrl = config.get<string>('dbUrl')

const options = {
    serverSelectionTimeoutMS: 60000,
};

class DB {
    static connect(log: any) {
        mongoose.set('strictQuery', false);
        mongoose
            .connect(dbUrl, options)
            .then(async () => {
                log.info(`========================================================`);
                log.info(`Successfully connected to `, { dbUrl: dbUrl });
                log.info(`========================================================`);
            })
            .catch((err: any) => {
                log.error(`There was a db connection error`, err);
                process.exit(0);
            });
        mongoose.connection.once('disconnected', () => {
            log.error(`Successfully disconnected from ${dbUrl}`);
        });
    }
}

export default DB;
