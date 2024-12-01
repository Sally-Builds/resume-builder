import path from 'path'
import { Router } from "express";
import { uploadInformationController } from "./optimizer.controller.js";
import multer from "multer";
import validate from '../../middlewares/validation.middleware.js';
import { uploadInfoSchema } from './optimizer.schema.js';
import ValidationError from '../../errors/ValidationError.js';

const router = Router()

const storage = multer.memoryStorage()
const fileFilter = (req: any, file: any, cb: any) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExtensions = ['.pdf', '.docx'];

    if (allowedExtensions.indexOf(ext) === -1) {
        return cb(new ValidationError("file format not allowed", [{ field: "resume", message: "format not supported" }]));
    }

    cb(null, true);
};

const upload = multer({ storage: storage, fileFilter })
const imageUpload = upload.single('resume')

router.post('/', imageUpload, validate(uploadInfoSchema), uploadInformationController)



export default router;