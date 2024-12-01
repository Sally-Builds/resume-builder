import { ChatOpenAI } from "@langchain/openai";
import { resumeParsePromptTemplate, resumeOptimizerTemplate, coverLetterPromptTemplate } from "./ai.templates.js";
import { IClientData } from "./ai.interface.js";
import { RunnableSequence } from "@langchain/core/runnables";
import { PromptTemplate } from '@langchain/core/prompts'
import { jsonCoverLetterOutputParser, jsonOutputParser } from "./ai.schema.js";



const model = new ChatOpenAI({
    modelName: "gpt-4o-mini",
    temperature: 0.5
});


export const optimize = async (jobPost: string, userResume: string) => {
    const response = await model.invoke(resumeOptimizerTemplate(jobPost, userResume))
    const parsedResume = parseJSONString(response.content as string)

    return parsedResume
}


function parseJSONString(input: string): IClientData | null {
    try {
        const jsonString = input.replace(/```json|```/g, '').trim();

        const parsedData = JSON.parse(jsonString);

        return parsedData;
    } catch (error) {
        console.error("Failed to parse JSON:", error);
        return null;
    }
}


export const optimizeV2 = async (jobPost: string, userResume: string) => {

    const comprehensiveChain = RunnableSequence.from([
        new PromptTemplate({
            inputVariables: ["userResume",
                "jobDescription",
                "formatInstructions"],
            template: resumeParsePromptTemplate()
        }),
        model,
        jsonOutputParser,

        async (parsedResume) => {
            const coverLetterChain = RunnableSequence.from([
                new PromptTemplate({
                    inputVariables: ["jobPost", "userResume", "formatInstructions"],
                    template: coverLetterPromptTemplate(),
                }),
                model,
                jsonCoverLetterOutputParser])

            const coverLetterResult = await coverLetterChain.invoke({ jobPost, userResume: JSON.stringify(parsedResume), formatInstructions: jsonCoverLetterOutputParser.getFormatInstructions() })
            return { cover_letter: coverLetterResult, resume: parsedResume }
        }
    ])

    const res = await comprehensiveChain.invoke({
        userResume,
        jobDescription: jobPost,
        formatInstructions: jsonOutputParser.getFormatInstructions()
    })

    return res
}
