import { Request, Response, NextFunction } from 'express';


export const testController = async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ data: 'req.body' })
}