import express from 'express'
import cors from 'cors'
import { errorHandler } from './middlewares/errorHandler.middleware';
import routes from './routes';
import 'express-async-errors'

const App = () => {
    const app = express();
    app.use(cors())
    app.use(express.json())

    //routes go here
    routes(app)

    app.use('*', (req, res, next) => {
        res.status(404).json({ message: "Notfound" })
    })

    app.use(errorHandler)
    return app
}

export default App

