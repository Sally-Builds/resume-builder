import IResume, { ICoverLetter } from "../builder/builder.interface.js";
import IOptimizedResume from "../builder/builder.interface2.js";

export interface IClientData {
    resume: IOptimizedResume,
    cover_letter: ICoverLetter,
}