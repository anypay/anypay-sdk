
# Anypay Platform for Node.js 

NOT YET IMPLEMENTED

```
import { app, demo } from 'anypay'

let anypay_app_token = process.env.ANYPAY_APP_TOKEN

let anypay = anypay.app(anypay_app_token)

let paymentRequest: PaymentRequest = await anypay.request([{

  currency: 'BSV'

  to: [{ demo.address('BSV'), demo.amount() }]

}])

let paymentRequest: PaymentRequest = await anypay.request([{

  currency: 'BSV'

  to: [{ demo.address('BSV'), demo.amount() }]

}, {

  currency: 'BCH',

  to: [{ demo.address('BCH'), demo.amount() }]

}])

paymentRequest.on('paid', payment => {

})

paymentRequest.on('expired', () => {

})

paymentRequest.on('cancelled', () => {

})

paymentRequest.on('rejection', rejectedPayment => {

})

```

