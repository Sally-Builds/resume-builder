export const AIResumeParseMessage = (initialPdfData: string) => {
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
        You are to optimize this resume to suit the job role perfectly and generate a cover letter. 

        here is the resume

        \`\`\`json${userResume}\`\`\`

        here is the job post

        \`\`\`json${jobPost}\`\`\`


        add to the skills area of the resume the skills required for the job,
        if there are experience duties that can make the user fit perfectly, add them to the matched experience section duties.
        Parse the optimized resume into the object with the following interface:
        Parse the cover letter into the object with the ICoverLetter interface:
        Your final json format should be IClientData interface
        
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
        
        default interface IResume {
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

        interface ICoverLetter {
            applicant_name: string;
            email: string;
            phone: string;
            todaysDate: Date //format eg - November 1, 2024
            paragraphs: string[];
            company_name: string;
        }

        export interface IClientData {
            resume: IResume,
            cover_letter: ICoverLetter,
        }

        Output strictly in JSON format.
    `
}

export const resumeParsePromptTemplate = () => {
    return `
    Transform the resume {userResume} into a structured JSON format without loosing any information.
   
    Output Requirements:
    i. Strictly follow the JSON structure

    1. CRITICALLY IMPORTANT: Preserve ALL original content from the resume
    2. If any section is unclear, keep it exactly as it was in the original
    3. using the job description {jobDescription} suggest skills that are required for this job and add them in the added_skills array
    4. using the job description suggest other duties or responsibilities that will make the user stand out and add them to the added_duties in any of the experience. They should be long sentences
    5. your suggested skills should be one word, two words or at most 4 word sentences.
    5. if there is no professionalSummary, then write one for the user.


    Response Format Instructions:
    {formatInstructions}

    CRITICAL: ANY INFORMATION LOSS WILL BE CONSIDERED A COMPLETE FAILURE

  `
}

export const coverLetterPromptTemplate = () => {
    return `
    Generate a cover letter not less than 450 words for the job post {jobPost} for the user with resume {userResume}
    The salutations should also be part of the paragraphs

    Response Format Instructions:
    {formatInstructions}
    `
}


// 2. Include all relevant details from the resume
// 3. Use accurate and professional language
// Using the job description {jobDescription}, if there are skills and responsibilities that will make the user stand out, add them to the added_responsibilities array and added_skills array 
// Also, if there is no professionalSummary, then write one for the user.
// 2. Return a comprehensive JSON with all original sections and contents

// Using the job description {jobDescription}, suggest duties and add them to the added_duties array where fit. 