
import {z} from "zod";

export const signInSchemaValidation = z.object({
         indefier: z.string(),
         password: z.string()
})




