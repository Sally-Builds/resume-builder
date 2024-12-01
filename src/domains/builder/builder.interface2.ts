export interface IOptimizedExperience {
    company: string;
    location: string;
    role: string;
    startDate: string;
    endDate: string;
    duties: string[]
    added_duties: string[]
}

export interface IExperience {
    company: string;
    location: string;
    role: string;
    startDate: string;
    endDate: string;
    responsibilities: string[]
}

export interface ISkills {
    current_skills: string[];
}

export interface IOptimizedSkills {
    current_skills: string[];
    added_skills: string[];
}

export interface IEducation {
    schoolName: string;
    degreeType: string;
    course: string;
    startDate: string;
    endDate: string;
    duties?: [];
}

export interface ICertificate {
    title: string;
    awarding_organization?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
}

export interface IProjectsOrFreelance {
    client_name: string;
    job_title: string;
    start_date: string;
    end_date: string;
    accomplishments: string[];
}

export interface IAdditionalInformation {
    courses_or_certificates: { section_title: string, content: ICertificate[] };
    languages: { section_title: string, content: string[] };
    projects_or_freelance_works: { section_title: string, content: IProjectsOrFreelance[] };
    awards: { section_title: string, content: string[] }
    hobbies_and_interest: { section_title: string, content: string[] };
}

export default interface IOptimizedResume {
    name: string;
    address: string;
    email: string;
    professionalSummary: { section_title: string, content: string };
    otherLinks: string[];
    phone: string;
    experience: { section_title: string, content: IOptimizedExperience[] };
    education: IEducation[];
    skills: { section_title: string, content: IOptimizedSkills };
    additional_information: IAdditionalInformation
}

export interface IResumeV2 {
    name: string;
    address: string;
    email: string;
    professionalSummary: { section_title: string, content: string };
    otherLinks: string[];
    phone: string;
    experience: { section_title: string, content: IExperience[] };
    education: IEducation[];
    skills: { section_title: string, content: ISkills };
    additional_information: IAdditionalInformation
}

export interface ICoverLetter {
    applicant_name: string;
    email: string;
    phone: string;
    todaysDate: Date //format eg - November 1, 2024
    paragraphs: string[];
    company_name: string;
}

