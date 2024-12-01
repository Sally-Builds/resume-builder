import PDFDocument from 'pdfkit'
import IResume, { IEducation, IExperience } from './builder.interface.js';
import fs from 'fs'

const LINE_SPACING = 1.15

function createHeader(doc: PDFKit.PDFDocument, text: string, fontSize = 14) {
    doc.fontSize(fontSize)
        .text(text, {
            lineGap: (fontSize * LINE_SPACING) - fontSize
        })
        .moveDown(0.2)
        .moveTo(doc.x, doc.y)
        .lineTo(doc.x + 500, doc.y)
        .stroke()
        .moveDown(0.5);
}


function addProfessionalExperience(doc: PDFKit.PDFDocument, experiences: IExperience[]) {

    experiences.forEach((experience: IExperience) => {
        doc.fontSize(12)
            .text(experience.role, {
                lineGap: (11 * LINE_SPACING) - 11
            })
            .fontSize(11)
            .text(`${experience.company} ${experience.location ? '- ' + experience.location : ''}`, { continued: true, lineGap: (11 * LINE_SPACING) - 11 })
            .text(`   ${experience.startDate} ${experience.endDate ? '- ' + experience.endDate : ""}`, { align: 'right', lineGap: (11 * LINE_SPACING) - 11 })
            .moveDown(0.5)
            .list([
                ...experience.duties
            ], { bulletRadius: 2, textIndent: 20, lineGap: (11 * LINE_SPACING) - 11 })
            .moveDown();
    })
}

function addEducation(doc: PDFKit.PDFDocument, education: IEducation[]) {

    education.forEach((education: IEducation, index: number) => {
        doc.fontSize(12)
            .text(education.course, {
                lineGap: (11 * LINE_SPACING) - 11
            })
            .fontSize(11)
            .text(education.schoolName, { continued: true, lineGap: (11 * LINE_SPACING) - 11 })
            .text(`   ${education.startDate} ${education.endDate ? '- ' + education.endDate : ''}`, { align: 'right', lineGap: (11 * LINE_SPACING) - 11 })
            .moveDown(index)
    })
}


export function buildResume(resumeObj: IResume) {
    // const doc = new PDFDocument();

    const doc = new PDFDocument({
        pdfVersion: '1.3',
        info: {
            Title: 'Print-Ready Resume',
            Author: 'Joshua Uzoagulu',
            Creator: 'PDFKit',
            // PDFXVersion: 'PDF/X-1a:2001',
            // GTS_PDFXVersion: 'PDF/X-1:2001',
            // Trapped: 'True'
        },
        compress: true
    });
    // Pipe the PDF to a file
    doc.pipe(fs.createWriteStream(`joshua_uzoagulu.pdf`));

    doc.moveTo(doc.x, doc.y)
        .lineTo(doc.x + 500, doc.y).moveDown(3)
    // Header
    doc.fontSize(24)
        .text(`${resumeObj.name}`, { align: 'center', lineGap: (11 * LINE_SPACING) - 11 })
        .fontSize(11)
        .text(`${resumeObj.address}   •   ${resumeObj.email}   •   ${resumeObj.phone}`, { align: 'center', lineGap: (11 * LINE_SPACING) - 11 })
        .moveDown(2)

    // Professional Summary
    createHeader(doc, 'Professional Summary');
    doc.fontSize(11)
        .text(resumeObj.professionalSummary, {
            lineGap: (11 * LINE_SPACING) - 11
        })
        .moveDown(2);

    // Employment History
    createHeader(doc, 'Employment History');

    // IT QA/QC Analyst
    addProfessionalExperience(doc, resumeObj.experience)

    // Education
    createHeader(doc, 'Education');

    addEducation(doc, resumeObj.education)


    // Certifications
    if (resumeObj.certificates.length > 0) {
        createHeader(doc, 'Certifications');
        doc.fontSize(11).list([
            'Certified Information System Auditor (CISA) - ISACA',
            'Certified in Risk and Information Systems Control (CRISC) - ISACA',
            'Certified Information Security Manager (CISM) - ISACA',
            'Project Management Professional (PMP) - PMI'
        ], { bulletRadius: 2, textIndent: 20, lineGap: (11 * LINE_SPACING) - 11 })
            .moveDown(2).fontSize(11);
    }

    // Skills
    createHeader(doc, 'Technical Skills');
    doc.fontSize(11).text(resumeObj.skills.join(", "), {
        lineGap: (11 * LINE_SPACING) - 11
    })
        .moveDown(2);

    // Awards
    // createHeader(doc, 'Awards');
    // doc.list([
    //     'Top Performer Award: Recognized for outstanding performance, leadership, and contributions to the audit team.',
    //     'Exceptional Service Award'
    // ], { bulletRadius: 2, textIndent: 20 }).fontSize(11);

    // Finalize the PDF
    doc.end();
}