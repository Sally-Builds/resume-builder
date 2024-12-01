import { Document, Packer, Paragraph, TextRun } from 'docx';
import { ICoverLetter } from './builder.interface.js';
import moment from 'moment'


export async function buildCoverLetter(coverLetterObj: ICoverLetter) {
    const doc = new Document({
        sections: [
            {
                children: [
                    // Date
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `${moment().format('Do MMMM, YYYY')}`,
                                size: 24, // 12pt font size
                            }),
                        ],
                        alignment: 'right',
                    }),

                    // Applicant's Information
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: coverLetterObj.applicant_name,
                                bold: true,
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: coverLetterObj.email.toLowerCase(),
                                size: 24, // 12pt font size
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: coverLetterObj.phone,
                                size: 24, // 12pt font size
                            }),
                        ],
                    }),

                    // Empty line for spacing
                    new Paragraph({}),

                    // Company Name
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: coverLetterObj.company_name,
                                size: 24, // 12pt font size
                            }),
                        ],
                        spacing: { after: 200 },
                    }),

                    // Cover Letter Content
                    ...coverLetterObj.paragraphs.map((paragraph) =>
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: paragraph,
                                    size: 20, // 12pt font size
                                }),
                            ],
                            spacing: { after: 200 },
                        })
                    ),
                ],
            },
        ],
    });

    // Save the document as a .docx file
    const buffer = await Packer.toBuffer(doc);
    // fs.writeFileSync('cover_letter.docx', buffer);
    return buffer
}
