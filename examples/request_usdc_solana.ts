
require('dotenv').config()

import { app, PaymentOption} from '../'

export async function main() {

  try {

    const anypay = app({

      apiBase: process.env.anypay_api_base,

      apiKey: process.env.anypay_api_key

    })

    let paymentRequest = await anypay.request({

      chain: 'SOL',

      currency: 'USDC',

      address: 'Ef9ca7Uwkw9rrbdaWnUrrdMZJqPYykZ1dPLEv9yMpEjB',

      amount: 0.05

    }, {

      webhook_url: 'https://7b3d-109-111-119-73.eu.ngrok.io/api/v1/webhooks'

    })

    console.log(paymentRequest)

    const { uid } = paymentRequest

    const paymentOption: PaymentOption = await anypay.getPaymentOption({
      uid,
      chain: 'SOL',
      currency: 'USDC'
    })

    console.log(paymentOption)

    console.log(JSON.stringify(paymentOption))

  } catch(error) {

    console.error(error)

  }

}

main()

