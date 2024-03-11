import {z} from "zod";

export const RegisterSchema = z.object({
    username: z.string({invalid_type_error: 'Username must be a string'}).min(3, 'Username must be at least 3 characters'),
    email: z.string({invalid_type_error: 'Email must be a string'}).email('Email is not valid'),
    password: z.string({invalid_type_error: 'Password must be a string'}).min(4, 'Password must be at least 4 characters'),
    passwordConfirm: z.string({invalid_type_error: 'Password confirmation must be a string'}),
    agree: z.boolean().refine(value => value === true, { message: 'You must agree to the terms and conditions' }),
}).refine(data => data.password === data.passwordConfirm, {
    message: 'Password confirm do not march',
    path: ['passwordConfirm']

})

