import IResume, { ICoverLetter } from "../builder/builder.interface.js";

export interface IOptimizerInfo {
    employee_email: string;
    client_email: string;
    company_name: string;
    job_title: string;
    job_description: string;
    resume: IFile
}

interface IFile {
    buffer: Buffer,
    mimeType: string,
}