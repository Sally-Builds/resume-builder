export interface IExperience {
    company: string;
    location: string;
    role: string;
    startDate: string;
    endDate: string;
    duties: string[]
}

export interface IEducation {
    schoolName: string;
    degreeType: string;
    course: string;
    startDate: string;
    endDate: string;
    duties: [];
}

export interface ICertificate {
    title: string;
    description?: string;
    startDate: string;
    endDate: string;
}

export default interface IResume {
    name: string;
    address: string;
    email: string;
    professionalSummary: string;
    otherLinks: string[];
    phone: string;
    experience: IExperience[];
    education: IEducation[];
    certificates: ICertificate[];
    skills: string[]
}

export interface ICoverLetter {
    applicant_name: string;
    email: string;
    phone: string;
    todaysDate: string //format eg - November 1, 2024
    paragraphs: string[];
    company_name: string;
}
