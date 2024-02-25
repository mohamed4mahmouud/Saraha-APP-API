import joi from "joi";

export const UpdatePasswordSchema = {
  body: joi
    .object()
    .required()
    .keys({
      currentPassword: joi.string().required(),
      newPassword: joi
        .string()
        .pattern(new RegExp("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$"))
        .required(),
      newConfirmPassword: joi.string().valid(joi.ref("newPassword")).required(),
    }),
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .unknown(true),
};
