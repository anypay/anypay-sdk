interface AnypayOptions {
    apiBase?: string;
    apiKey?: string;
  }
  
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
  
      this.apiKey = options.apiKey || '1f2a4a55-85ed-4935-af60-1ec91e75e2fc';
      this.apiBase = options.apiBase || 'https://api.anypayx.com'
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
  
        resp.body.uid = resp.body.invoice_uid
        
        delete resp.body.invoice_uid
  
        return Object.assign(resp.body, resp.body.options)
  
       } catch(error) {
  
        console.error(error.response.error)
  
        throw error.response.error
  
       }
  
    }

    async createInvoice(template, options={}): Promise<CreateInvoiceResponse> {
  
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

          if (resp.status === 400) {
            throw new Error(resp.body.payload)
          }
    
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
  
