
//zod performs for validation, if any error existing in the schema instantly throws an error and validated the data structure;
import { z } from "zod";


//username validation using zod laibrary;
export const usernameValidation = z
       .string()
       .min(3, "Username must be at least 3 characters!")
       .max(20, "Username must be more than 20 characters!")
       .regex(/^[a-zA-Z0-9_]+$/, "Username cant be contain special characters!")


//signup validation through the zod laibraries

export const signUpSchemaValidation = z.object({
    username: usernameValidation,
    email: z.string().email({message: "Invalid emaila addresh"}),
    password:z.string().min(6, {message:"Password must be at least 6 characters"}).max(10, {message: "Passwod must be al leat two characters"})
})

