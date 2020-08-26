import * as assert from 'assert'
require('dotenv').config()

import { app, demo, schema } from '../src/lib'
import { PaymentRequest } from '../src/lib/types'

const anypay = app(process.env.ANYPAY_APP_TOKEN) 

describe("Anypay Payments SDK", () => {

  it("should create a request for a multi-output payment", async () => {

    let paymentRequest = await anypay.request([{
      currency: 'BCH',
      to: [{
        address: demo.address('BCH'),
        amount: 10,
        currency: 'USD'
      }, {
        address: demo.address('BCH'),
        amount: 150,
        currency: 'USD'
      }]
    }])

    assert(paymentRequest.url.match(/^https:\/\/api.anypayinc.com\/r/))
    assert(paymentRequest.uri.match(/^pay?r=https:\/\/api.anypayinc.com\/r/))
    assert(paymentRequest.uid)

  })

  it("should send a webhook whenever a payment request is fulfilled")

  it('should validate a payment request template against the schema', () => {

    let { error, value } = schema.PaymentRequestTemplate.validate([{
      currency: 'BTC',
      to: []
    }])

    assert(error)

  })

  it('should accept a base unit (satoshis) amount without currency specified', () => {

    let { error, value } = schema.PaymentRequestTemplate.validate([{
      currency: 'DASH',
      to: [{
        address: demo.address('DASH'),
        amount: 2500
      }]
    }])

    assert(!error)
    assert(value)

  })

  it('should optionally specify the base currency (USD,JPY,AUD,etc)', () => {

    let { error, value } = schema.PaymentRequestTemplate.validate([{
      currency: 'DASH',
      to: [{
        address: demo.address('BSV'),
        amount: 10,
        currency: 'USD'
      },{
        address: demo.address('BSV'),
        amount: 150,
        currency: 'JPY',
      },{
        address: demo.address('BSV'),
        amount: 20,
        currency: 'AUD'
      }]
    }])

    assert(!error)
    assert(value)

  })



  it("should be able to cancel a payment request", async () => {

    let paymentRequest = await anypay.request([{
      currency: 'BSV',
      to: [{
        address: 'steven@simply.cash',
        amount: 0.21,
        currency: 'USD'
      }]
    }])

    paymentRequest = await anypay.cancel(paymentRequest.uid)

  })

})

