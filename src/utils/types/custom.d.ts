import { Request } from 'express';
import { MulterFile } from 'multer';


declare global {
    namespace Express {
        export interface Request {
            files: { [fieldname: string]: Express.Multer.File[] };
            file: { [fieldname: string]: Express.Multer.File }
        }
    }
}