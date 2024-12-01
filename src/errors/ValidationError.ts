import { AppError } from "../utils/AppError.js";


export default class ValidationError extends AppError {
    statusCode = 400;

    constructor(public readonly message: string, public readonly data: { field: string, message: string }[]) {
        super(message)
        Object.setPrototypeOf(this, ValidationError.prototype)
    }

    serialize(): { message: string, errorType: string, data: { field: string, message: string }[] } {
        return {
            message: this.message,
            data: this.data,
            errorType: 'VALIDATION_ERROR',
        }
    }
}