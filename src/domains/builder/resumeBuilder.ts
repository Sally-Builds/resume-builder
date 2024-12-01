import { Document, Packer, Paragraph, TextRun, HeadingLevel, BorderStyle } from 'docx';
// import IResume, { IEducation, IExperience } from './builder.interface.js';
import IOptimizedResume, { IAdditionalInformation, ICertificate, IEducation, IOptimizedExperience } from './builder.interface2.js';

// color: #996e00

function createHorizontalLine(spaceTop: number, spaceBottom: number): Paragraph {
    return new Paragraph({
        border: {
            top: {
                color: "000000", // Black line
                space: 1,
                size: 6, // Thickness of the line
                style: BorderStyle.SINGLE,
            },
        },
        spacing: {
            before: spaceTop,  // Space before the line
            after: spaceBottom, // Space after the line
        },
        children: [],
    });
}


function createHeader(text: string, fontSize = 24) {
    return new Paragraph({
        children: [
            new TextRun({
                text,
                bold: true,
                size: 24, // 12pt font size
                color: "000000"
            }),
        ],
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 0, before: 200 },
    });
}

function createSubHeader(text: string, fontSize = 24) {
    return new Paragraph({
        children: [
            new TextRun({
                text,
                bold: true,
                size: 24, // 12pt font size
                color: "000000"
            }),
        ],
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 100, before: 200 },
    });
}

function addProfessionalExperience(experiences: IOptimizedExperience[]) {
    return experiences.map((experience) => [
        new Paragraph({
            children: [
                new TextRun({
                    text: experience.role,
                    bold: true,
                    size: 19, // 12pt font size
                }),
            ],
        }),
        new Paragraph({
            children: [
                new TextRun({
                    text: `${experience.company} ${experience.location ? '- ' + experience.location : ''}`,
                    size: 19,
                }),
                new TextRun({
                    text: `   ${experience.startDate} ${experience.endDate ? '- ' + experience.endDate : ""}`,
                    bold: true,
                    size: 19,
                }),
            ],
        }),
        ...experience.duties.map((duty) =>
            new Paragraph({
                children: [
                    new TextRun({
                        text: duty,
                        size: 19, // 12pt font size #996e00
                    }),
                ],
                bullet: { level: 0 },
                spacing: { after: 100 },
            })
        ),

        ...experience.added_duties.map((duty) =>
            new Paragraph({
                children: [
                    new TextRun({
                        text: duty,
                        size: 19, // 12pt font size 
                        color: "#996e00"
                    }),
                ],
                bullet: { level: 0 },
                spacing: { after: 100 },
            })
        )

    ]).flat();
}

function addEducation(education: IEducation[]) {
    return education.map((edu) => [
        new Paragraph({
            children: [
                new TextRun({
                    text: edu.course,
                    bold: true,
                    size: 19, // 12pt font size
                }),
            ],
        }),
        new Paragraph({
            children: [
                new TextRun({ text: edu.schoolName, size: 19, }),
                new TextRun({
                    text: `   ${edu.startDate} ${edu.endDate ? '- ' + edu.endDate : ''}`,
                    bold: true,
                    size: 19,
                }),
            ],
        }),
    ]).flat();
}

function addCertificates(certificates: ICertificate[]) {
    return certificates.flatMap(certificate => [
        new Paragraph({
            children: [
                new TextRun({
                    text: certificate.title,
                    size: 19, // 12pt font size
                }),
            ],
        }),
        new Paragraph({
            children: [
                new TextRun({
                    text: certificate.awarding_organization,
                    size: 19, // 12pt font size
                    italics: true,
                }),
            ],
        }),
        new Paragraph({
            children: [
                new TextRun({
                    text: [certificate.endDate, certificate.startDate].filter(Boolean).join(' - '),
                    size: 19, // 12pt font size
                }),
            ],
        })

    ])
}

function addAdditionalInformation(additional_information?: IAdditionalInformation) {
    // return ,
}


export async function buildResume(resumeObj: IOptimizedResume) {
    const contactInfo = [
        resumeObj.address,
        resumeObj.email.toLowerCase(),
        resumeObj.phone
    ].filter(Boolean).join(' • ');
    const doc = new Document({
        sections: [
            {
                properties: {},
                children: [
                    createHorizontalLine(0, 100),
                    // Applicant's Name and Contact Info
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: resumeObj.name,
                                bold: true,
                                size: 45, // 12pt font size
                            }),
                        ],
                        alignment: 'center',
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: contactInfo,
                                size: 19, // 12pt font size
                            }),
                        ],
                        alignment: 'center',
                    }),

                    // Professional Summary
                    createHeader(resumeObj.professionalSummary.section_title),
                    createHorizontalLine(0, 10),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: resumeObj.professionalSummary.content,
                                size: 19, // 12pt font size
                            }),
                        ],
                    }),

                    // Employment History
                    createHeader(resumeObj.experience.section_title),
                    createHorizontalLine(0, 10),
                    ...addProfessionalExperience(resumeObj.experience.content),

                    // Education
                    createHeader('Education'),
                    createHorizontalLine(0, 10),
                    ...addEducation(resumeObj.education),

                    // Technical Skills
                    createHeader('Technical Skills'),
                    createHorizontalLine(0, 10),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: resumeObj.skills.content.current_skills.join(", "),
                                size: 19, // 12pt font size
                            }),
                            ...(resumeObj.skills.content.added_skills ? [
                                new TextRun({
                                    text: ", ",
                                    size: 19, // 12pt font size
                                }),
                            ] : []),
                            new TextRun({
                                text: resumeObj.skills.content.added_skills?.join(", "),
                                size: 19, // 12pt font size
                                color: "#996e00"
                            }),
                        ],
                    }),

                    ...(hasAdditionalInformationContent(resumeObj.additional_information) ? [
                        createHeader('Additional Information'),
                        createHorizontalLine(0, 10),

                        ...(resumeObj.additional_information.courses_or_certificates.content.length > 0 ? [
                            createSubHeader(resumeObj.additional_information.courses_or_certificates.section_title),

                            ...addCertificates(resumeObj.additional_information.courses_or_certificates.content)

                        ] : [])

                    ] : [])

                ],
            },
        ],
    });


    // Save the document as a .docx file
    const buffer = await Packer.toBuffer(doc);
    // fs.writeFileSync('resume.docx', buffer);
    return buffer
}


function hasAdditionalInformationContent(additionalInfo?: IAdditionalInformation): boolean {
    if (!additionalInfo) return false;

    return (
        additionalInfo.courses_or_certificates.content.length > 0 ||
        additionalInfo.languages.content.length > 0 ||
        additionalInfo.projects_or_freelance_works.content.length > 0 ||
        additionalInfo.awards.content.length > 0 ||
        additionalInfo.hobbies_and_interest.content.length > 0
    );
}
