import { Express } from "express";
import userRoute from './domains/user/user.router.js'
import optimizerRoute from './domains/optimizer/optimizer.router.js'

const routes = (app: Express) => {
    app.use('/api/v1/users', userRoute)
    app.use('/api/v1/optimizer', optimizerRoute)
}

export default routes;