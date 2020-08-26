
# Anypay Platform for Node.js 

NOT YET IMPLEMENTED

```
import { app, demo } from 'anypay'
import { PaymentRequest } from '@anypay/types'

let anypay_app_token = process.env.ANYPAY_APP_TOKEN

let anypay = anypay.app(anypay_app_token)

let paymentRequest: PaymentRequest = await anypay.requestPayment([{

  currency: 'BSV'

  to: [{ demo.address('BSV'), demo.amount() }]

}])

let paymentRequest: PaymentRequest = await anypay.requestPayment([{

  currency: 'BSV'

  to: [{ demo.address('BSV'), demo.amount() }]

}, {

  currency: 'BCH',

  to: [{ demo.address('BCH'), demo.amount() }]

}])

```
