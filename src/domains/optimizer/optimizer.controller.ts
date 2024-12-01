import { Request, Response, NextFunction } from 'express';
import ValidationError from '../../errors/ValidationError.js';
import { optimizeResume } from './optimizer.service.js';


export const uploadInformationController = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
        throw new ValidationError("resume is required", [{ field: "resume", message: "Please provide client resume" }]);
    }

    const data = await optimizeResume({
        ...req.body,
        resume: {
            mimeType: req.file.mimetype,
            buffer: req.file.buffer
        }
    })
    res.status(200).json({ data })
}