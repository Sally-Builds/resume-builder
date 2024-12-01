import dotenv from 'dotenv';
dotenv.config();

export default {
    port: parseInt(process.env.PORT || '3000'),
    host: process.env.HOST || 'localhost',
    slackWebhookUrl: process.env.SLACK_WEBHOOK || "",
    openAiApiKey: process.env.OPENAI_API_KEY || "",
    redisPort: parseInt(process.env.REDIS_PORT || "6379"),
    redisHost: process.env.REDIS_HOST || "",
    redisUsername: process.env.REDIS_USERNAME || "",
    googleDriveFolderId: process.env.GOOGLE_DRIVE_FOLDER_ID || ""
};