import { StructuredOutputParser } from "@langchain/core/output_parsers";
import * as z from 'zod';



// Experience Schema
export const ExperienceSchema = z.object({
    company: z.string(),
    location: z.string(),
    role: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    duties: z.array(z.string()),
    added_duties: z.array(z.string()).optional()
});

// Skills Schema
export const SkillsSchema = z.object({
    current_skills: z.array(z.string()),
    added_skills: z.array(z.string()).optional()
});

// Education Schema
export const EducationSchema = z.object({
    schoolName: z.string(),
    degreeType: z.string(),
    course: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    duties: z.array(z.string()).optional()
});

// Certificate Schema
export const CertificateSchema = z.object({
    title: z.string(),
    awarding_organization: z.string().optional(),
    description: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional()
});

// Projects or Freelance Schema
export const ProjectsOrFreelanceSchema = z.object({
    client_name: z.string(),
    job_title: z.string(),
    start_date: z.string(),
    end_date: z.string(),
    accomplishments: z.array(z.string())
});

// Additional Information Schema
export const AdditionalInformationSchema = z.object({
    courses_or_certificates: z.object({
        section_title: z.string(),
        content: z.array(CertificateSchema)
    }).optional(),
    languages: z.object({
        section_title: z.string(),
        content: z.array(z.string())
    }).optional(),
    projects_or_freelance_works: z.object({
        section_title: z.string(),
        content: z.array(ProjectsOrFreelanceSchema)
    }).optional(),
    awards: z.object({
        section_title: z.string(),
        content: z.array(z.string())
    }).optional(),
    hobbies_and_interest: z.object({
        section_title: z.string(),
        content: z.array(z.string())
    }).optional()
});

// Resume Schema
export const ResumeSchema = z.object({
    name: z.string(),
    address: z.string(),
    email: z.string().email().transform((val) => val.replace(/\s+/g, '').toLowerCase()),
    professionalSummary: z.object({
        section_title: z.string(),
        content: z.string()
    }),
    otherLinks: z.array(z.string()),
    phone: z.string(),
    experience: z.object({
        section_title: z.string(),
        content: z.array(ExperienceSchema)
    }),
    education: z.array(EducationSchema),
    skills: z.object({
        section_title: z.string(),
        content: SkillsSchema
    }),
    additional_information: AdditionalInformationSchema.optional()
});

export interface ICoverLetter {
    applicant_name: string;
    email: string;
    phone: string;
    todaysDate: Date //format eg - November 1, 2024
    paragraphs: string[];
    company_name: string;
}

export const coverLetterSchema = z.object({
    applicant_name: z.string(),
    email: z.string(),
    phone: z.string(),
    todaysDate: z.string(), //format eg - November 1, 2024
    paragraphs: z.array(z.string()),
    company_name: z.string(),
})

export const jsonOutputParser = StructuredOutputParser.fromZodSchema(ResumeSchema)
export const jsonCoverLetterOutputParser = StructuredOutputParser.fromZodSchema(coverLetterSchema)