
import { PaymentRequest } from './payment_request'

export { PaymentRequest }

import { schema } from './schema'

import { PaymentOption } from './payment_option'

export { PaymentOption }

export { schema } 

import { App, AnypayOptions } from './app'

import { Invoice } from './invoice'

export { Invoice, getInvoice } from './invoice'

export { Payment } from './payment'

export { Confirmation } from './confirmation'

export function app(options: AnypayOptions) {

  return new App(options)

}

const defaultApp = new App({
  apiKey: '1f2a4a55-85ed-4935-af60-1ec91e75e2fc',
  apiBase: 'https://api.anypayx.com'
})

export default defaultApp

export async function refresh(invoice: Invoice): Promise<Invoice> {

  return invoice
}

export async function cancel(invoice: Invoice): Promise<Invoice> {

  return invoice
}

export { demo } from './demo'

export async function request(params) {

  return defaultApp.request(params)

}

export { events, subscribe, SubscribeOptions } from './websockets'
