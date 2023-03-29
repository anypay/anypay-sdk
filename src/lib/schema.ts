const Joi = require('joi');

interface SimplePaymentRequest {
  chain: string;
  currency: string;
  address: string;
  amount: number;
}

interface MultiCoinPaymentRequest {
  currency: string;
  chain?: string;
  to: {
    address: string;
    amount: number;
    currency?: string;
  }[]
}

export type PaymentRequestTemplate = SimplePaymentRequest | MultiCoinPaymentRequest[]  | SimplePaymentRequest[] 

const SimplePaymentRequestSchema = Joi.object({
  chain: Joi.string().required(),
  currency: Joi.string().required(),
  address: Joi.string().required(),
  amount: Joi.number().required()
})

const To = Joi.object({
  address: Joi.string().required(),
  amount: Joi.number().required(),
  currency: Joi.string()
}).required()

const PaymentRequestTemplateSchema = Joi.alternatives().try(

  Joi.array().items(

    Joi.object({
      currency: Joi.string().required(),
      to: Joi.array().items(To).required()
    }).required()
  ),

  SimplePaymentRequestSchema,

  Joi.array().items(SimplePaymentRequestSchema)

)

const PaymentRequestOptionsSchema = Joi.object().keys({
  webhook_url: Joi.string().uri().optional(),
  redirect_url: Joi.string().uri().optional(),
  secret: Joi.string().optional(),
  metadata: Joi.object().optional()
})

const schema = {
  PaymentRequestTemplate: PaymentRequestTemplateSchema,
  PaymentRequestOptions: PaymentRequestOptionsSchema
}

export { schema }

