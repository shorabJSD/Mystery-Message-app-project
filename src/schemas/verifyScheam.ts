
import {z} from "zod";

export const verifyScheamValidation = z.object({
         code: z.string().length(6, "Verification code must be 6 characters")
})




