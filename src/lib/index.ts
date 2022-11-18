
import { PaymentRequest } from './payment_request'

export { PaymentRequest }

import { schema } from './schema'

export { schema } 

import { App } from './app'

import { Invoice } from './invoice'

export { Invoice } from './invoice'

export function app(anypay_app_token) {

  return new App(anypay_app_token)

}

const defaultApp = new App('1f2a4a55-85ed-4935-af60-1ec91e75e2fc')

export default defaultApp

export async function refresh(invoice: Invoice): Promise<Invoice> {

  return invoice
}

export async function cancel(invoice: Invoice): Promise<Invoice> {

  return invoice
}

export { demo } from './demo'
