
import * as http from 'superagent'

import { PaymentRequest } from './types'

export { PaymentRequest }

const Joi = require('joi');

const templateSchema = Joi.array().items(
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

class Anypay {

  apiKey: string
  apiBase: string

  constructor(apiKey: string) {

    this.apiKey = apiKey
    this.apiBase = process.env.ANYPAY_API_BASE || 'https://pay.anypayinc.com'
  }

  async request(template): Promise<PaymentRequest> {

    const { error, value } = templateSchema.validate(template)

    if (error) {
      console.error(error.message)
      throw error;
    }

    try {

      let resp = await http
        .post(`${this.apiBase}/r`)
        .auth(this.apiKey, '')

      return resp.body

     } catch(error) {

      console.error(error.message)

      throw error

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

      throw error

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

