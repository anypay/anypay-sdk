
import * as http from 'superagent'

import { PaymentRequest } from './types'

export { PaymentRequest }

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

class Anypay {

  apiKey: string
  apiBase: string

  constructor(apiKey: string) {

    this.apiKey = apiKey
    this.apiBase = process.env.ANYPAY_API_BASE || 'https://api.anypayinc.com'
  }

  async request(template, options={}): Promise<PaymentRequest> {

    const { error, value } = schema.PaymentRequestTemplate.validate(template)

    if (error) {
      console.error(error.message)
      throw error;
    }

    const { optionsError } = schema.PaymentRequestOptions.validate(options)

    if (optionsError) {
      console.error(error.message)
      throw error;
    }

    try {

      let url = `${this.apiBase}/r` 

      let resp = await http
        .post(url)
        .send({ template, options })
        .auth(this.apiKey, '')

      resp.body.payment_request.uid = resp.body.payment_request.invoice_uid
      delete resp.body.payment_request.invoice_uid

      return Object.assign(resp.body.payment_request, resp.body.options)

     } catch(error) {

      console.error(error.response.error)

      throw error.response.error

     }

  }

  async cancel(uid: string) {

    try {

      let resp = await http
        .post(`${this.apiBase}/r/${uid}/cancel`)
        .auth(this.apiKey, '')

      return resp.body

     } catch(error) {

      console.error(error.message)

      throw error.response.error

     }

  }

  async show(uid: string) {

    try {

      let resp = await http
        .get(`${this.apiBase}/r/${uid}/status`)
        .auth(this.apiKey, '')

      return resp.body

     } catch(error) {

      console.error(error.message)

      throw error

     }
  }

  async list(uid: string) {

    try {

      let resp = await http
        .get(`${this.apiBase}/r`)
        .auth(this.apiKey, '')

      return resp.body

     } catch(error) {

      console.error(error.message)

      throw error

     }

  }

}

export function app(anypay_app_token) {

  return new Anypay(anypay_app_token)

}

class Demo {

  address(currency) {

    switch(currency) {
    case 'BSV':
      return '153QX8cGtiXJdPjRMevWpYdmSPqitb6fQv'
      break
    case 'BCH':
      return 'bitcoincash:qr2wnq2pzyrffwv25d6x9gf5re8p084u05s3nfu8am'
      break
    case 'DASH':
      return 'XhwA3PbbGRZWiicCFiT2t4QPHfpzeP38VG'
      break
    case 'BTC':
      return '1Cfo9eXDbXoPU17E7yJpHG49SYikV47pKN'
      break
    }
  }

  amount() {
    return 1000
  }
}

const demo = new Demo()

export { demo }

