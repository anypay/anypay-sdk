
import axios from 'axios'

import { EventEmitter } from "events";

import { PaymentRequest } from "./payment_request";

import fetch from 'axios'

import { Confirmation } from './confirmation'

import { Payment } from './payment'

const API_BASE = `https://api.anypayx.com`

const URI_BASE = `pay:?r=https://api.anypayx.com/i`

import { WebSocket } from 'ws'

export interface InvoiceOptions {
    paymentRequest?: PaymentRequest
    apiBase?: string;
    apiKey?: string;
    websocketUrl?: string;
}

export interface PaymentConfirmation {
  payment?: Payment,
  confirmation?: Confirmation
}

export class Invoice extends EventEmitter {

    websocket: WebSocket;

    uid: string;

    apiBase: string;

    websocketUrl: string;

    apiKey: string;

    paymentRequest: PaymentRequest;

    invoiceData: any;

    constructor(uid: string, options: InvoiceOptions = {}) {
        super()

        this.uid = uid

        this.apiBase = options.apiBase || API_BASE

        this.apiKey = options.apiKey

        this.websocketUrl = options.websocketUrl || 'wss://ws.anypayx.com'
    }

    static fromPaymentRequest(paymentRequest: PaymentRequest): Invoice {

        const invoice = new Invoice(paymentRequest.uid)

        invoice.paymentRequest = paymentRequest

        return invoice
    }

    async fetch() {

        const url = `${this.apiBase}/invoices/${this.uid}`

        const { data } = await axios.get(url)

        this.paymentRequest = data

    }

    get uri() {

        const uriBase: string = URI_BASE

        return `${uriBase}/${this.uid}`
    }

    get status() {
        return this.invoiceData.status
    }

    async getPaymentConfirmation(): Promise<PaymentConfirmation> {

      // TODO: Actually Fetch Payment & Confirmation Detail


      const url = `${this.apiBase}/api/v1/invoices/${this.uid}/events`

      const { data } = await axios.get(`${url}`, {
        auth: {
          username: this.apiKey,
          password: ''
        }
      })

      const response: PaymentConfirmation = {}

      if (data.payment) {

        response.payment = new Payment(data.payment)

      }

      if (data.confirmation) {

        response.confirmation = new Confirmation(data.confirmation)

      }

      return response

    }

    async getPayment(): Promise<Payment> {

      const url = `${this.apiBase}/api/v1/invoices/${this.uid}/payment`

      const { data } = await axios.get(`${url}`, {
        auth: {
          username: this.apiKey,
          password: ''
        }
      })

      const payment = new Payment(data.payment)

      return payment

    }

    async listEvents(): Promise<Event[]> {

      if (!this.apiKey) {

        throw new Error('api key required to list events')

      }

      const url = `${this.apiBase}/api/v1/invoices/${this.uid}/events`

      const { data } = await axios.get(`${url}`, {
        auth: {
          username: this.apiKey,
          password: ''
        }
      })

      return data.events.map(event => new Event(event))

    }

    async awaitPayment(options?: AwaitPaymentOptions): Promise<Payment> {

      let begin = new Date()

      let expired = false

      let payment: Payment

      let interval = options.interval || 15 * 1000

      while (!payment && !expired) {

        payment = await this.getPayment() 

        await delay(interval)

      }

      return payment

    }

    async connectWebsocket(): Promise<WebSocket> {

      if (!this.websocket) {

        this.websocket = new WebSocket(this.websocketUrl, {
          headers: {
            'anypay-invoice-uid': this.uid
          }
        })

        this.websocket.on('open', () => {
          console.debug('anypay.websocket.opened')

          this.emit('websocket.connected')

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

            this.emit(type, payload)

          } catch(error) {

            console.debug('websocket.message.received.json.parse.error', error)

          }
          
        })

      }
        
      return this.websocket

    }

}

class Event {
  account_id: number;
  app_id: number;
  invoice_uid: string;
  type: string;
  payload: any;

  constructor(data) {
    const { account_id, app_id, invoice_uid, type, payload } = data

    this.account_id = account_id
    this.app_id = app_id
    this.invoice_uid = invoice_uid
    this.type = type
    this.payload = payload
  }
}

function delay(ms: number): Promise<void> {

  return new Promise((resolve, reject) => {

    setTimeout(resolve, ms)

  })
}

interface AwaitPaymentOptions {
  interval: number;
  timeout: number;
}

interface GetInvoiceOptions {
  uid: string;
  apiBase?: string;
  apiKey?: string;
}

export async function getInvoice({uid, apiBase, apiKey}: GetInvoiceOptions): Promise<Invoice> {

  const invoice = new Invoice(uid, { apiBase, apiKey })

  await invoice.fetch()

  return invoice

}

