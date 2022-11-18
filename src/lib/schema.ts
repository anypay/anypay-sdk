const Joi = require('joi');

const PaymentRequestTemplateSchema = Joi.array().items(

  Joi.object({
    currency: Joi.string().required(),
    to: Joi.array().items(

      Joi.object({
        address: Joi.string().required(),
        amount: Joi.number().required(),
        currency: Joi.string()
      }).required()
    
    ).required()
  }).required()
)

const PaymentRequestOptionsSchema = Joi.object().keys({
  webhook: Joi.string().uri().optional(),
  redirect: Joi.string().uri().optional(),
  secret: Joi.string().optional(),
  metadata: Joi.object().optional()
})

const schema = {
  PaymentRequestTemplate: PaymentRequestTemplateSchema,
  PaymentRequestOptions: PaymentRequestOptionsSchema
}

export { schema }