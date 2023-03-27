
require('dotenv').config()

import { app } from './src/lib' 

import { Websocket } from 'ws'

const anypay = app({
  apiKey: process.env.anypay_api_key,
  websocketUrl: process.env.anypay_websocket_url || 'ws://localhost:5201'
})

export async function main() {

  anypay.on('websocket.message.received', ({type, payload}) => {

    console.log('anypay.websocket.message.received.message', {type, payload})

  })

  anypay.events.on('invoice.created', ({type,payload}) => {

    console.log('Invoice Created', {type, payload})

  })

  anypay.events.on('invoice.paid', ({type,payload}) => {

    console.log('Invoice Paid!', {type, payload})

  })

}

main()

