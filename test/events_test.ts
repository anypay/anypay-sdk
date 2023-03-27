
require('dotenv').config()

import { app, Invoice, Payment, getInvoice } from '../src/lib'

import unauthenticated from '../src/lib'

import { expect } from './utils'

import { wallets } from './fixtures'

const apiBase = process.env.anypay_api_base || 'https://api.anypayx.com'

describe("Invoice Events", () => {

  it('should require an access token to retrieve invoice events', async () => {

    const invoice_uid = 'iQBfCPVjX'

    const anypay = app({ apiBase })

    const invoice = await anypay.getInvoice({ uid: invoice_uid })

    expect(invoice.listEvents()).to.eventually.be.rejected

  })

  if (process.env.anypay_api_key) {

    it('should fetch the history of events related to an invoice', async () => {

      const invoice_uid = 'iQBfCPVjX'

      const anypay = app({
        apiKey: process.env.anypay_api_key,
        apiBase
      })

      const invoice = await anypay.getInvoice({ uid: invoice_uid })

      const events = await invoice.listEvents()

      for (let event of events) {

        expect(event.type).to.be.a('string')

        expect(event.payload).to.be.an('object')

        expect(event.invoice_uid).to.be.equal(invoice_uid)

      }

    })

  } else {

    it.skip('should fetch the history of events related to an invoice')

  }

})

