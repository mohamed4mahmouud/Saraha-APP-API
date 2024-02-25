import joi from "joi";

export const signUpSchema = {
  body: joi
    .object()
    .required()
    .keys({
      userName: joi.string().min(4).max(10).required(),
      email: joi
        .string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
      password: joi
        .string()
        .pattern(new RegExp("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$")) //Minimum eight characters, at least one letter and one number
        .required(),
      passwordConfirm: joi.string().valid(joi.ref("password")).required(),
    }),
};
