import { IAIQueueData, IBuilderQueue, IGoogleDriveUploadQueue, ISlackQueueData, googleDriveQueue, resumeBuilderQueue, slackQueue } from "../../utils/bullMQ.js"
import { uploadBasic } from "../../utils/googleAPI.js"
import { sendToSlack } from "../../utils/slack.js"
import { optimize, optimizeV2 } from "../AI/ai.service.js"
import { buildCoverLetter } from "../builder/coverLetterBuilder.js"
import { buildResume } from "../builder/resumeBuilder.js"
import { IOptimizerInfo } from "../optimizer/optimizer.interface.js"

export const applicationProcessing = async (payload: IOptimizerInfo, jobPost: string, text: string) => {
    const response = await optimize(JSON.stringify(jobPost), text)

    if (!response) return null
    const coverLetterBuffer = await buildCoverLetter(response.cover_letter)
    const resumeBuffer = await buildResume(response.resume);
    console.log(text)

    const coverLetterFileName = `${response.resume.name.split(' ').join('-')}-${response.cover_letter.company_name.split(' ').join('-')}-coverLetter.docx`
    const resumeFileName = `${response.resume.name.split(' ').join('-')}-${response.cover_letter.company_name.split(' ').join('-')}-resume.docx`
    const coverLetterId = uploadBasic(coverLetterFileName, coverLetterBuffer)
    const resumeId = uploadBasic(resumeFileName, resumeBuffer)


    const slackPayload = {
        client_email: payload.client_email,
        employee_email: payload.employee_email,
        company_name: payload.company_name,
        job_title: payload.job_title,
        resume_url: `https://docs.google.com/document/d/${resumeId}/edit`,
        cover_letter_url: `https://docs.google.com/document/d/${coverLetterId}/edit`
    }
}

// 1)
export const aiProcessing = async (data: IAIQueueData) => {
    const response = await optimizeV2(JSON.stringify(data.jobPost), data.resume)

    if (!response) return null
    //add next queue
    await resumeBuilderQueue.add({
        ...data,
        cover_letter: response.cover_letter,
        resume: response.resume

    })
}

export const builderProcessing = async (data: IBuilderQueue) => {
    const coverLetterBuffer = await buildCoverLetter(data.cover_letter)
    const resumeBuffer = await buildResume(data.resume);

    const coverLetterFileName = `${data.resume.name.split(' ').join('-')}-${data.cover_letter.company_name.split(' ').join('-')}-coverLetter.docx`
    const resumeFileName = `${data.resume.name.split(' ').join('-')}-${data.cover_letter.company_name.split(' ').join('-')}-resume.docx`

    console.log(coverLetterFileName)
    //add next queue
    await googleDriveQueue.add({
        ...data,
        cover_letter_fileName: coverLetterFileName,
        cover_letter_buffer: coverLetterBuffer,
        resume_fileName: resumeFileName,
        resume_buffer: resumeBuffer,
    })
}


export const googleDriveProcessing = async (data: IGoogleDriveUploadQueue) => {
    console.log('google drive processing')
    console.log(data.cover_letter_buffer, 'cover letter buffer')
    console.log(data.resume_buffer, 'resume buffer')
    const coverLetterId = await uploadBasic(data.cover_letter_fileName, data.cover_letter_buffer)
    const resumeId = await uploadBasic(data.resume_fileName, data.resume_buffer)

    console.log(coverLetterId, 'coverletter id')
    console.log(resumeId, 'resume id')
    if (!coverLetterId || !resumeId) return

    //add next queue
    await slackQueue.add({
        ...data,
        cover_letter_id: coverLetterId,
        resume_id: resumeId,
    })
}


export const slackMessageProcessing = async (data: ISlackQueueData) => {
    const slackPayload = {
        client_email: data.client_email,
        employee_email: data.employee_email,
        company_name: data.company_name,
        job_title: data.job_title,
        resume_url: `https://docs.google.com/document/d/${data.resume_id}/edit`,
        cover_letter_url: `https://docs.google.com/document/d/${data.cover_letter_id}/edit`
    }

    await sendToSlack(slackPayload)
}