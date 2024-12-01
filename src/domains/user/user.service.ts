import { pdfToText } from "pdf-ts";
import path from 'path'
import fs from 'fs'
import IResume from "../builder/builder.interface.js";
import { ChatOpenAI } from "@langchain/openai";
import { buildResume } from "../builder/builder.service.js";
import { JobPostMessageTemplate, scrape } from "../scraper/scrapper.service.js";
import { IJobPost } from "../scraper/scrapper.interface.js";

const jobTitle = '';

const model = new ChatOpenAI({
    model: "gpt-4o-mini",
    temperature: 0,
});


function parseJSONString(input: string): IResume | null {
    try {
        const jsonString = input.replace(/```json|```/g, '').trim();

        const parsedData = JSON.parse(jsonString);

        return parsedData;
    } catch (error) {
        console.error("Failed to parse JSON:", error);
        return null;
    }
}

const AIResumeParseMessage = (initialPdfData: string) => {
    return `
    Below is my resume:

    ${initialPdfData}

    if there is no professional summary, use the information you have to write one, it should'nt me more than a paragraph.
    if there is a professional summary, make it concise and not more than a paragraph
    parse the data in the resume into the object with the following interface:
    
    interface IExperience {
        company: string;
        location: string;
        role: string;
        startDate: string;
        endDate: string;
        duties: string[]
    }
    
    interface IEducation {
        schoolName: string;
        degreeType: string;
        course: string;
        startDate: string;
        endDate: string;
        duties: [];
    }
    
    interface ICertificate {
        title: string;
        startDate: string;
        endDate: string;
    }
    
    export default interface IResume {
        name: string;
        address: string;
        email: string;
        otherLinks: string[];
        phone: string;
        professionalSummary: string;
        experience: IExperience[];
        education: IEducation[];
        certificates: ICertificate[];
        skills: string[]
    }

    Output strictly in JSON format.
`
}

export const resumeOptimizerTemplate = (jobPost: string, userResume: string) => {
    return `
        You are to optimize this resume to suit the job role perfectly. 

        here is the resume

        \`\`\`json${userResume}\`\`\`

        here is the job post

        \`\`\`json${jobPost}\`\`\`


        add to the skills area of the resume the skills required for the job,
        if there are experience duties that can make the user fit perfectly, add them to the matched experience section duties.
        if the resume and job role are very far apart return an empty json
        Parse the optimized resume into the object with the following interface:
        
        interface IExperience {
            company: string;
            location: string;
            role: string;
            startDate: string;
            endDate: string;
            duties: string[]
        }
        
        interface IEducation {
            schoolName: string;
            degreeType: string;
            course: string;
            startDate: string;
            endDate: string;
            duties: [];
        }
        
        interface ICertificate {
            title: string;
            startDate: string;
            endDate: string;
        }
        
        export default interface IResume {
            name: string;
            address: string;
            email: string;
            otherLinks: string[];
            phone: string;
            professionalSummary: string;
            experience: IExperience[];
            education: IEducation[];
            certificates: ICertificate[];
            skills: string[]
        }

        Output strictly in JSON format.
    `
}

const optimizeResume = async (jobUrl: string) => {
    const jobPostStructured = await getStructuredJobPost(jobUrl)
    const jobPost = JSON.stringify(jobPostStructured);
    const resumeStructured = await getStructuredResume();
    console.log(resumeStructured)
    const userResume = JSON.stringify(resumeStructured)
    const response = await model.invoke(resumeOptimizerTemplate(jobPost, userResume))

    const parsedResume = parseJSONString(response.content as string)
    return parsedResume
}

export const getStructuredResume = async () => {
    const filePath = path.join(
        "public",
        "UZOAGULU.pdf"
    )

    const fileData = fs.readFileSync(filePath);
    const pdfContent = await pdfToText(fileData);

    const message = AIResumeParseMessage(pdfContent)
    const resumeResponse = await model.invoke(message)
    const parsedResume = parseJSONString(resumeResponse.content as string)

    return parsedResume
}

// export const generateResume = async () => {
//     const parsedResume = await getStructuredResume()
//     await buildResume(parsedResume as IResume)

// }

export const getStructuredJobPost = async (jobUrl: string) => {
    const data = await scrape(jobUrl)

    const message = JobPostMessageTemplate(data)
    const response = await model.invoke(message)
    const parsedJob = parseJSONString(response.content as string)

    return parsedJob

    // return data
}



export const generateOptimizedResume = async (jobUrl: string) => {
    const optimizedStructuredResume = await optimizeResume(jobUrl)
    await buildResume(optimizedStructuredResume as IResume)

    return optimizedStructuredResume
}


