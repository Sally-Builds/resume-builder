import Bull from 'bull'
import IResume, { ICoverLetter } from '../domains/builder/builder.interface.js';
import { aiProcessing, builderProcessing, googleDriveProcessing, slackMessageProcessing } from '../domains/jobs/index.js';
import IOptimizedResume from '../domains/builder/builder.interface2.js';


const options: Bull.QueueOptions = {
    redis: {
        port: 6379,
        host: "127.0.0.1",
        username: "default",
    },
    settings: {
        lockDuration: 30000, // 30 seconds
        stalledInterval: 30000,
        maxStalledCount: 1
    }
}

export enum QueueNames {
    AI_QUEUE = 'AI_QUEUE',
    RESUME_BUILDER_QUEUE = 'RESUME_BUILDER_QUEUE',
    GOOGLE_DRIVE_QUEUE = 'GOOGLE_DRIVE_QUEUE',
    SLACK_MESSAGE_QUEUE = "SLACK_MESSAGE_QUEUE",
}

interface IClientAndJobDetails {
    client_email: string;
    employee_email: string;
    company_name: string;
    job_title: string;
}

export interface IAIQueueData extends IClientAndJobDetails {
    jobPost: string;
    resume: string;
}

export interface IBuilderQueue extends IClientAndJobDetails {
    cover_letter: ICoverLetter,
    resume: IOptimizedResume
}

export interface IGoogleDriveUploadQueue extends IClientAndJobDetails {
    cover_letter_fileName: string;
    resume_fileName: string;
    cover_letter_buffer: Buffer;
    resume_buffer: Buffer;
}

export interface ISlackQueueData extends IClientAndJobDetails {
    resume_id: string;
    cover_letter_id: string;
}

export const aiQueue = new Bull<IAIQueueData>(QueueNames.AI_QUEUE, options);
export const slackQueue = new Bull<ISlackQueueData>(QueueNames.SLACK_MESSAGE_QUEUE, options);
export const resumeBuilderQueue = new Bull<IBuilderQueue>(QueueNames.RESUME_BUILDER_QUEUE, options);
export const googleDriveQueue = new Bull<IGoogleDriveUploadQueue>(QueueNames.GOOGLE_DRIVE_QUEUE, options);



aiQueue.process(10, async (job: Bull.Job<IAIQueueData>) => {
    await aiProcessing(job.data)
    console.log('1) ai processing done')
})

resumeBuilderQueue.process(5, async (job: Bull.Job<IBuilderQueue>) => {
    await builderProcessing(job.data)
    console.log('2) builder processing done')
})

googleDriveQueue.process(15, async (job: Bull.Job<IGoogleDriveUploadQueue>) => {
    console.log('entered the google drive')
    await googleDriveProcessing(job.data)
    console.log('3) google drive processing done')
})

slackQueue.process(20, async (job: Bull.Job<ISlackQueueData>) => {
    await slackMessageProcessing(job.data)
    console.log('4) slack processing done')
})