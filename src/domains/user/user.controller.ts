import { Request, Response, NextFunction } from 'express';
import { generateOptimizedResume, getStructuredJobPost, getStructuredResume } from './user.service.js';




export const getStructuredResumeController = async (req: Request, res: Response, next: NextFunction) => {
    const resumeObj = await getStructuredResume()
    res.status(200).json({ data: { resume: resumeObj } })
}

export const getStructuredJobPostController = async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body)
    const resumeObj = await getStructuredJobPost(req.body.jobUrl)
    res.status(200).json({ data: { jobPost: resumeObj } })
}

export const generateOptimizedResumeController = async (req: Request, res: Response, next: NextFunction) => {
    const resumeObj = await generateOptimizedResume(req.body.jobUrl)
    res.status(200).json({ data: { resume: resumeObj, message: "Resume generation complete" } })
}









