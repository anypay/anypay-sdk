
import { PaymentRequest } from './payment_request'

export { PaymentRequest }

import { schema } from './schema'

export { schema } 

import { App } from './app'

import { Invoice } from './invoice'

export { Invoice, getInvoice } from './invoice'

export { Payment } from './payment'

export { Confirmation } from './confirmation'

export function app(anypay_app_token) {

  return new App(anypay_app_token)

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

