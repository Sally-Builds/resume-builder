import { GoogleAuth } from 'google-auth-library'
import { google } from 'googleapis'
import apiKey from '../../resume-builder-secret.json' assert { type: 'json' }
import { Readable } from 'stream'
import config from '../../config/default.js'

/**
 * Insert new file.
 * @return{obj} file Id
 * */
export async function uploadBasic(fileName: string, buffer: Buffer) {
    const auth = new GoogleAuth({
        scopes: 'https://www.googleapis.com/auth/drive',
        credentials: apiKey
    });
    const service = google.drive({ version: 'v3', auth });
    const requestBody = {
        name: fileName,
        fields: 'id',
        parents: [config['googleDriveFolderId']]
    };

    buffer = Buffer.from(buffer)
    const readable = Readable.from(buffer)
    try {

        const media = {
            mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            body: readable,
        };

        const file = await service.files.create({
            requestBody,
            media: media,
        });
        console.log('File Id:', file.data.id);
        return file.data.id;
    } catch (err) {
        // TODO(developer) - Handle error
        console.log(err)
        throw err;
    }
}