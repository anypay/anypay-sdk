
# Anypay Platform for Node.js 

Not Yet Implemented

```

let anypay_app_token = process.env.ANYPAY_APP_TOKEN

let anypay = new Anypay(anypay_app)

let paymentRequest: PaymentRequest = await anypay.requestPayment([{

  currency: 'BSV'

  to: [{ bsvAddress, bsvAmount }]

}])

let paymentRequest: PaymentRequest = await requestPayment([{

  currency: 'BSV'

  to: [{ address, amount }]

}, {

  currency: 'BCH',

  to: [{ bchAddress, bchAmount }]

}])

```
