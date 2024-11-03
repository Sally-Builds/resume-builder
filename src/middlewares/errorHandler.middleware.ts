import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { AppError } from '../utils/AppError'


export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {

    if (err instanceof AppError) {
        res.status(err.statusCode).json(err.serialize())
    } else {
        res.status(500).json({ message: "Something went wrong!" })
    }

}