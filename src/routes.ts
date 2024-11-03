import { Express } from "express";
import userRoute from './domains/user/user.router'

const routes = (app: Express) => {
    app.use('/api/v1/users', userRoute)
}

export default routes;