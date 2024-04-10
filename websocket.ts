
require('dotenv').config()

import { SubscribeOptions, subscribe, events } from './src/lib' 

export async function main() {

  const subscribeOptions: SubscribeOptions = {
    websocket: {
        auth: {
            token: String(process.env.ANYPAY_AUTH_TOKEN)
        }
    }
  }

  if (process.env.ANYPAY_WEBSOCKET_URL) {

      subscribeOptions.websocket.url = process.env.ANYPAY_WEBSOCKET_URL

  }

  subscribe(subscribeOptions)

  .onInvoiceCreated((event: events.InvoiceCreatedEvent) => {        
      console.log(JSON.stringify(event))
  })
  .onInvoiceCancelled((event: events.InvoiceCancelledEvent) => {

      console.log(JSON.stringify(event))
  })
  .onInvoicePaid((event: events.InvoicePaidEvent) => {

      console.log(JSON.stringify(event))
  })
  .onPaymentConfirming((event: events.PaymentConfirmingEvent) => {

      console.log(JSON.stringify(event))
  })
  .onPaymentConfirmed((event: events.InvoiceCancelledEvent) => {

      console.log(JSON.stringify(event))
  })
  .onPaymentFailed((event: events.PaymentFailedEvent) => {

      console.log(JSON.stringify(event))
  })
  .onWebsocketConnected((event: events.WebsocketConnectedEvent) => {

      console.log(JSON.stringify(event))
  })
  .onError((error: Error) => {
      
      console.error(error)
  })


}

main()

