import * as assert from 'assert'
require('dotenv').config()

import { app, demo } from '../src/lib'

const anypay = app(process.env.ANYPAY_API_KEY) 

describe("Anypay Payments SDK", () => {

  it("#should create a request for a multi-output payment", async () => {

    let paymentRequest = await anypay.requestPayment({
      to: [{
        paymail: 'steven@simply.cash',
        amount: 10,
        currency: 'USD'
      }, {
        paymail: 'zyler@handcash.io',
        amount: 150,
        currency: 'USD'
      }]
    })

    assert(paymentRequest.url.match(/^https:\/\/api.anypayinc.com\/r/))
    assert(paymentRequest.uri.match(/^pay?r=https:\/\/api.anypayinc.com\/r/))
    assert(paymentRequest.uid)

  })

  it("should send a webhook whenever a payment request is fulfilled")

  it("#should be able to cancel a payment request", async () => {

    let paymentRequest = await anypay.requestPayment({
      to: [{
        paymail: 'steven@simply.cash',
        amount: 10,
        currency: 'USD'
      }]
    })

    paymentRequest = await anypay.cancel(paymentRequest.uid)

  })

})

