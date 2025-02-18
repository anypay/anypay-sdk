
export interface AnypayOptions {
  apiKey?: string;
  apiBase?: string;
  websocketUrl?: string;
  connectWebsocket?: boolean;
}

import { PaymentOption } from './payment_option'

import { PaymentRequestOptions } from './payment_request'

import { WebSocket } from 'ws'

import axios from 'axios'

import * as http from 'superagent'
  
import { PaymentRequest } from './payment_request'

export { PaymentRequest }

import { schema, PaymentRequestTemplate } from './schema'

import { EventEmitter } from "events";

import { Invoice } from './invoice'

interface CreateInvoiceResponse {
  invoice: Invoice;
  refresh: Function;
  cancel: Function;
  paymentOptions: Function;
}

export class App extends EventEmitter {

  apiKey: string

  apiBase: string;

  websocket: WebSocket;

  websocketUrl: string;

  events: EventEmitter;

  constructor(options: AnypayOptions = {}) {

    super()

    this.events = new EventEmitter()

    this.apiKey = options.apiKey

    this.apiBase = options.apiBase || 'https://api.anypayx.com'

    this.websocketUrl = options.websocketUrl || 'wss://ws.anypayx.com'

    const shouldConnectWebsocket = options.connectWebsocket === true ? true : false

    if (this.apiKey && shouldConnectWebsocket) {

      this.connectWebsocket()

    }
  }

  async sendMessage(type: string, payload: any) {
    this.websocket.send(JSON.stringify({
      type,
      payload
    }))
  }

  async connectWebsocket(): Promise<WebSocket> {

    if (!this.websocket) {

      this.websocket = new WebSocket(this.websocketUrl, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'anypay-access-token': this.apiKey
        }
      })

      this.websocket.on('open', () => {

        this.sendMessage('authenticate', {
          token: this.apiKey
        })
      })

      this.websocket.on('error', (error) => {
        console.error("anypay.websocket.error", error)
      })

      this.websocket.on('disconnect', (reason) => {
        console.log("anypay.websocket.disconnected", reason)

        setTimeout(() => {
          this.websocket = null
          console.debug("anypay.websocket.reconnecting")
          const connectWebsocket = this.connectWebsocket

          setImmediate(connectWebsocket)

        }, 5000)
      })

      this.websocket.on('close', (reason) => {
        console.log("anypay.websocket.close", reason)

        setTimeout(() => {
          delete this.websocket;
          console.debug("anypay.websocket.reconnecting")
          setImmediate(this.connectWebsocket)
        }, 5000)
      })

      this.websocket.on('message', message => {

        try {

          const { type, payload } = JSON.parse(message.toString('utf8'))

          this.emit('websocket.message.received', {type,payload})

          this.events.emit(type, payload)

        } catch(error) {

          console.debug('websocket.message.received.json.parse.error', error)

        }
        
      })

    }
      
    return this.websocket

  }

  async request(template: PaymentRequestTemplate, options: PaymentRequestOptions={}): Promise<PaymentRequest> {

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


      if (!Array.isArray(template)) {

        template = [{
          chain: template.chain,
          currency: template.currency,
          to: [{
            address: template.address,
            amount: template.amount,
            currency: template.currency
          }]
        }]

      }

      let resp = await http
          .post(url)
          .send({ template, options })
          .auth(this.apiKey, '')

      const data = resp.body

      data.uid = data.invoice_uid

      return Object.assign(data, data.options)

     } catch(error) {

       console.error(error)

       throw error.response.data.error

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

  async getPaymentOption({ uid, chain, currency }: { uid: string, chain: string, currency: string }): Promise<PaymentOption> {

    const { data } = await axios.post(`${this.apiBase}/r/${uid}`, {
      chain, currency
    }, {
      headers: {
        'content-type': 'application/payment-request'
      }
    })

    return new PaymentOption({ uid, chain, currency, data })

  }

}
