
import { PaymentRequest } from './payment_request'

export { PaymentRequest }

import { schema } from './schema'

export { schema } 

import { App } from './app'

import { Invoice } from './invoice'

export { Invoice } from './invoice'

import EventEmitter from 'eventemitter3'

export { Wallet } from './wallet'

export function app(params) {

  return new App(params)

}

export function init(params) {

  return new App(params)

}

const defaultApp = new App()

export default defaultApp

export async function refresh(invoice: Invoice): Promise<Invoice> {

  return invoice
}

export async function cancel(invoice: Invoice): Promise<Invoice> {

  return invoice
}

export { demo } from './demo'


export { subscribe } from './websocket'

export async function createInvoice(): Promise<EventEmitter> {

  return new EventEmitter()

}

import { Options } from './payment_request'

export async function requestPayment(options: Options): Promise<EventEmitter> {

  return new EventEmitter()

}

export { log } from './log'