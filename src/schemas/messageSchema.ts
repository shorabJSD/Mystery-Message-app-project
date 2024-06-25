
import {z} from "zod";

export const messageSchemaValidation = z.object({
         content: z
         .string()
         .min(10, {message: "content must be at least 10 characters"})
         .max(300, {message: "content must be no longer than 300 characters"})
})




