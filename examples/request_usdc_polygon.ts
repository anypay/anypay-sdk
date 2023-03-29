
require('dotenv').config()

import { app, PaymentOption} from '../'

export async function main() {

  try {

    const anypay = app({

      apiBase: process.env.anypay_api_base,

      apiKey: process.env.anypay_api_key

    })

    let paymentRequest = await anypay.request({

      chain: 'MATIC',

      currency: 'USDC',

      address: '0xA77547a3fB82a5Fa4DB408144870B69c70906989',

      amount: 0.05

    }, {

      webhook_url: 'https://7b3d-109-111-119-73.eu.ngrok.io/api/v1/webhooks'

    })

    console.log(paymentRequest)

    const { uid } = paymentRequest

    const paymentOption: PaymentOption = await anypay.getPaymentOption({
      uid,
      chain: 'MATIC',
      currency: 'USDC'
    })

    console.log(paymentOption)

  } catch(error) {

    console.error(error)

  }

}

main()

