import mammoth from 'mammoth'
import { IOptimizerInfo } from "./optimizer.interface.js";
import { pdfToText } from "pdf-ts";
import { aiQueue } from '../../utils/bullMQ.js';
// import { PDFDocument } from 'pdf-lib'
// import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import pkg from 'pdfjs-dist';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
pkg.GlobalWorkerOptions.workerSrc = path.join(
    // '../../',
    __dirname,
    '../../../../node_modules/pdfjs-dist/build/pdf.worker.js'
);


export const optimizeResume = async (payload: IOptimizerInfo) => {
    const resume = await extractText(payload.resume.buffer, payload.resume.mimeType)
    const jobPost = { company_name: payload.company_name, job_title: payload.job_title, job_description: payload.job_description }

    await aiQueue.add({
        client_email: payload.client_email,
        employee_email: payload.employee_email,
        company_name: payload.company_name,
        resume: resume,
        job_title: payload.job_title,
        jobPost: JSON.stringify(jobPost),
    })
    return 'Your Job is now processing...'

}


const extractText = async (buffer: Buffer, mimeType: string) => {
    let text: string = '';
    if (mimeType == 'application/pdf') {
        text = await extractTextWithPosition(buffer)
    }

    if (mimeType == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const docxData = await mammoth.extractRawText({ buffer: buffer });
        text = docxData.value;
    }

    return text;
}


async function extractTextWithPosition(buffer: Buffer) {
    const loadingTask = pkg.getDocument({ data: buffer });
    const pdf = await loadingTask.promise;
    let fullText: string[] = [];

    for (let i = 0; i < pdf.numPages; i++) {
        const page = await pdf.getPage(i + 1);
        const textContent = await page.getTextContent();

        // Collect items with their positions
        const itemsWithPositions = textContent.items.map((item: any) => ({
            text: item.str,
            x: item.transform[4], // x position
            y: item.transform[5], // y position
        }));

        // Sort items by Y first (descending) and X (ascending) to match visual order
        itemsWithPositions.sort((a: any, b: any) => {
            if (a.y === b.y) return a.x - b.x; // Sort by x if y positions are equal
            return b.y - a.y; // Sort by y (PDF coordinates start from bottom-left)
        });

        // Combine sorted text
        const pageText = itemsWithPositions.map((item: any) => item.text).join(' ');
        fullText.push(pageText);
    }

    return fullText.join('\n'); // Combine all pages' text
}