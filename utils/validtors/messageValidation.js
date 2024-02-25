import Joi from "joi";
import JoiObjectid from "joi-objectid";

Joi.objectId = JoiObjectid(Joi);

export const messageSchema = {
  params: Joi.object().required().keys({
    recieverId: Joi.objectId().required(),
  }),
  body: Joi.object().required().keys({
    text: Joi.string().required(),
  }),
};
