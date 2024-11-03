export abstract class AppError extends Error {
    constructor(message: string) {
        super(message)
    }

    abstract statusCode: number;
    abstract serialize(): { message: string, errorType: string, data?: { field: string, message: string }[] }
}
