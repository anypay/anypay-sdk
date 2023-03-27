interface AnypayOptions {
  apiKey?: string;
  apiBase?: string;
}

import axios from 'axios'
  
import { PaymentRequest } from './payment_request'

export { PaymentRequest }

import { schema } from './schema'

import { EventEmitter } from "events";

import * as http from 'superagent'

import { Invoice } from './invoice'

interface CreateInvoiceResponse {
  invoice: Invoice;
  refresh: Function;
  cancel: Function;
  paymentOptions: Function;
}

export class App extends EventEmitter {

  apiKey: string

  apiBase: string

  constructor(options: AnypayOptions = {}) {

    super()

    this.apiKey = options.apiKey

    this.apiBase = options.apiBase || 'https://api.anypayx.com'
  }

  async request(template, options={}): Promise<PaymentRequest> {

    const { error, value } = schema.PaymentRequestTemplate.validate(template)

    if (error) {
      throw error;
    }

    const { optionsError } = schema.PaymentRequestOptions.validate(options)

    if (optionsError) {
      throw error;
    }

    try {

      let url = `${this.apiBase}/r` 

      let resp = await http
        .post(url)
        .send({ template, options })
        .auth(this.apiKey, '')

      resp.body.uid = resp.body.invoice_uid
      
      delete resp.body.invoice_uid

      return Object.assign(resp.body, resp.body.options)

     } catch(error) {

       console.error(error.response.body.payload)

       throw error.response.error

     }

  }

  async createInvoice(template, options={}): Promise<CreateInvoiceResponse> {

      const { error, value } = schema.PaymentRequestTemplate.validate(template)
  
      if (error) {
        throw error;
      }
  
      const { optionsError } = schema.PaymentRequestOptions.validate(options)
  
      if (optionsError) {
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
  
        const paymentRequest = Object.assign(resp.body.payment_request, resp.body.options)

        const invoice = new Invoice(paymentRequest.uid)

        invoice.paymentRequest = paymentRequest

        const cancel = async function () {

        }

        const refresh = async function () {

        }

        const paymentOptions = async function() {

        }

        return {

          invoice,

          cancel,

          refresh,

          paymentOptions

        }
  
       } catch(error) {
  
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

      throw error

     }
  }

  async list(uid: string) {

    try {

      let { data } = await axios.get(`${this.apiBase}/r`, {
        auth: {
          username: this.apiKey,
          password: ''
        }
      })

      return data

     } catch(error) {

      throw error

     }

  }

  async getInvoice({ uid }: { uid: string }): Promise<Invoice> {

    let invoice = new Invoice(uid, {
      apiBase: this.apiBase,
      apiKey: this.apiKey
    })

    await invoice.fetch()

    return invoice

  }

}
