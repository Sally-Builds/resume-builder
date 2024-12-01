export interface IJobPost {
    jobTitle: string;
    company: string;
    jobDescription: string;
    jobRequirements: string;
    workingCondition: IWorkingConditions;
    location?: string
}

interface IWorkingConditions {
    condition: 'hybrid' | 'remote' | "onsite",
    furtherInformation?: string;
}