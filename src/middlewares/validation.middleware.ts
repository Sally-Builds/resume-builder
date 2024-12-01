import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";
import ValidationError from "../errors/ValidationError.js";

const validate =
    (schema: AnyZodObject) =>
        (req: Request, res: Response, next: NextFunction) => {
            try {
                const data = schema.parse({
                    body: req.body,
                    query: req.query,
                    params: req.params,
                    // files: req.files,
                    // file: req.file
                });
                req.body = data.body
                req.query = data.query
                req.params = data.params
                req.files = data.files
                // req.file = data.file
                next();
            } catch (e: any) {
                const errors = e.errors.map((error: any) => {
                    return {
                        field: error.path[1],
                        message: error.message
                    }
                })
                throw new ValidationError("Validation Error", errors)
            }
        };

export default validate;