import { AppError } from "../utils/AppError.js";

export default class BadRequestError extends AppError {
    statusCode = 400;

    constructor(public readonly message: string) {
        super(message)
        Object.setPrototypeOf(this, BadRequestError.prototype)
    }

    serialize(): { message: string, errorType: string, data?: { field: string, message: string }[] } {
        return {
            message: this.message,
            errorType: 'BAD_REQUEST',
            data: [{ field: 'email', message: "enter a valid email." }]
        }
    }
}