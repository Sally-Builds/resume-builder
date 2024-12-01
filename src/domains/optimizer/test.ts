import fs from 'fs';
import { Document, Paragraph, Run } from 'docx';
import { PDFDocument } from 'pdf-lib';

export async function extractTextAndLinksFromDOCX(fileBuffer: Buffer): Promise<{ text: string; link?: string }[]> {
    try {
        // Load the DOCX file from the buffer
        const document = await (Document as any).load(fileBuffer);

        // Extract text and link information
        const textAndLinks: { text: string; link?: string }[] = [];
        for (const paragraph of document.body.children) {
            for (const run of paragraph.children) {
                if (run.properties.hyperlink) {
                    textAndLinks.push({
                        text: run.text,
                        link: run.properties.hyperlink.link
                    });
                } else {
                    textAndLinks.push({
                        text: run.text
                    });
                }
            }
        }

        return textAndLinks;
    } catch (error) {
        console.error('Error extracting text and links from DOCX file:', error);
        return [];
    }
}

export async function extractTextAndLinksFromPDF(fileBuffer: Buffer): Promise<{ text: string; link?: string }[]> {
    try {
        // Load the PDF file from the buffer
        const pdfDoc = await PDFDocument.load(fileBuffer);

        // Extract text and link information
        const textAndLinks: { text: string; link?: string }[] = [];
        const pages = await pdfDoc.getPages();
        for (const page of pages) {
            const annotations = await (page as any).getAnnotations();
            for (const annotation of annotations) {
                if (annotation.url) {
                    textAndLinks.push({
                        text: await annotation.getText(),
                        link: annotation.url
                    });
                } else {
                    const text = await (page as any).getText();
                    textAndLinks.push({
                        text
                    });
                }
            }
        }

        return textAndLinks;
    } catch (error) {
        console.error('Error extracting text and links from PDF file:', error);
        return [];
    }
}