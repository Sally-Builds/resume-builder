import { Router } from "express";
import { generateOptimizedResumeController, getStructuredJobPostController, getStructuredResumeController } from "./user.controller.js";


const router = Router();

router.get('/structured-resume', getStructuredResumeController)
router.post('/structured-job-post', getStructuredJobPostController)
router.post('/generate-optimized-resume', generateOptimizedResumeController)
// router.get('/', scrapeController)

export default router

