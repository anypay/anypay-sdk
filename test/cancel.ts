require('dotenv').config()

import { app, Invoice } from '../src/lib'

import { expect } from './utils'

const anypay = app({
  apiKey: process.env.ANYPAY_APP_TOKEN
}) 

describe("Cancelling Invoices", () => {

  it("should cancel an unpaid invoice", async () => {

    const {invoice, cancel, refresh} = await anypay.createInvoice([{
      currency: 'BCH',
      chain: 'BCH',
      to: [{
        address: 'bitcoincash:qqnagffkhu2548h6f22c7hpyv0aae54p2vyzaftusk',
        amount: 10,
        currency: 'EUR'
      }]
    }])

    expect(invoice.status).to.be.equal('unpaid')

    const cancelled = cancel(invoice)
  
    expect(cancelled.status).to.be.equal('cancelled')

    await refresh()

    expect(invoice.status).to.be.equal('cancelled')

  })

  it("#cancel should cause an event to me emitted on the app", (done) => {

    anypay.createInvoice([{
      currency: 'BCH',
      chain: 'BCH',
      to: [{
        address: 'bitcoincash:qqnagffkhu2548h6f22c7hpyv0aae54p2vyzaftusk',
        amount: 10,
        currency: 'EUR'
      }]
    }])
    .then(({invoice, cancel}) => {

      anypay.on('invoice.cancelled', (cancelled: Invoice) => {

        expect(cancelled.status).to.be.equal('cancelled')
  
        expect(invoice.uid).to.be.equal(cancelled.uid)

        done()
  
      })

      cancel(invoice)

    })

  })

  it("#cancel should cause an event to me emitted on the invoice", async (done) => {

    anypay.createInvoice([{
      currency: 'BCH',
      chain: 'BCH',
      to: [{
        address: 'bitcoincash:qqnagffkhu2548h6f22c7hpyv0aae54p2vyzaftusk',
        amount: 10,
        currency: 'EUR'
      }]
    }])
    .then(({invoice, cancel}) => {

      invoice.on('cancelled', (cancelled: Invoice) => {

        expect(cancelled.status).to.be.equal('cancelled')

        expect(invoice.uid).to.be.equal(cancelled.uid)

        done()

      })

      cancel()

    })

  })

})
