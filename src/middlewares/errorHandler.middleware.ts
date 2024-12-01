import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { AppError } from '../utils/AppError.js'


export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {

    if (err instanceof AppError) {
        res.status(err.statusCode).json(err.serialize())
    } else {
        console.log(err)
        res.status(500).json({ message: "Something went wrong!" })
    }

}