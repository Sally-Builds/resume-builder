import z, { object, string, number, literal, TypeOf } from "zod";

export const uploadInfoSchema = object({
    body: object({
        employee_email: string({
            required_error: "First name is required"
        }).trim().email("Invalid email address").transform(value => value.trim().toLowerCase()),

        client_email: string({
            required_error: "Last name is required"
        }).trim().email("Invalid email address").transform(value => value.trim().toLowerCase()),

        company_name: string({
            required_error: "Email is required",
        }).trim(),

        job_title: string({
            required_error: "Email is required",
        }).trim(),

        job_description: string({
            required_error: "Email is required",
        }).trim(),
    }),
});

export type uploadInfoInput = TypeOf<typeof uploadInfoSchema>;