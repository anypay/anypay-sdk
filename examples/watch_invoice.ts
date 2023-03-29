
require('dotenv').config()

import { Invoice } from '../src/lib'

export async function main() {

  const uid = process.argv[2] || 'b8ht9PrBy'

  const invoice = new Invoice(uid, {
    websocketUrl: 'wss://ws.anypayx.com'
  })

  await invoice.connectWebsocket()

  invoice.on('websocket.connected', () => {

    console.log('invoice websocket connected')

  })

  invoice.on('websocket.message.received', console.log)

}

main()

