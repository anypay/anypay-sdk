
require('dotenv').config()

import anypay from 'anypay'

export async function main() {

  let paymentRequest = await anypay.request([{

    currency: 'BSV',

    to: [{
      address: '1C9jt1rdpjvhEgT7TirEnxrz2eVpS3vqfZ',
      amount: 52.00,
      currency: 'USD'
    }, {
      address: '123AeiwXiYswoNrNRCvPekkKJYvoUzyxbC',
      amount: 8.00,
      currency: 'USD'
    }, {
      address: '123AeiwXiYswoNrNRCvPekkKJYvoUzyxbC',
      amount: 0.001,
      currency: 'USD'
    }]

  }], {

    webhook_url: 'https://example.com/anypay-webhooks'

  })

  console.log(paymentRequest)

}

main()

