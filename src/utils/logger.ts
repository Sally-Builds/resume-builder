import winston from 'winston'

const { combine, json, timestamp, prettyPrint, errors } = winston.format


const logger = winston.createLogger({
    level: 'debug',
    format: combine(timestamp(), json(), prettyPrint(), errors()),
    transports: [
        new winston.transports.Console({ level: "info" }),
        new winston.transports.File({ filename: "server.log", level: "error" })
    ]
})


export default logger