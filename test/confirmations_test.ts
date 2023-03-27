
require('dotenv').config()

import { app, Invoice, Payment, getInvoice } from '../src/lib'

import { expect } from './utils'

import { wallets } from './fixtures'

describe("Confirming Invoice Payments", () => {

  const anypay = app({
    apiBase: process.env.anypay_api_base || 'https://api.anypayx.com',
  })

  it('should fetch payment confirmation details for paid invoice', async () => {

    const invoice_uid = 'iQBfCPVjX'

    const invoice = await anypay.getInvoice({ uid: invoice_uid })

    const {payment, confirmation} = await invoice.getPaymentConfirmation()

    console.log({ payment, confirmation })

    expect(payment.txid).to.be.a('string')

    expect(payment.chain).to.be.equal('BTC')

    expect(payment.currency).to.be.equal('BTC')

    expect(confirmation.block_hash).to.be.a('string')

    expect(confirmation.block_height).to.be.a('number')

    expect(confirmation.block_index).to.be.a('number')
 
    expect(confirmation.timestamp).to.be.a('number')

  })

  it('should have neither payment nor confirmation for new invoice', async () => {

    const {invoice, cancel, refresh} = await anypay.createInvoice([{
      currency: 'BTC',
      chain: 'BTC',
      to: wallets.BTC[0].address,
      amount: {
        value: 10,
        currency: 'EUR'
      }
    }])

    const {payment, confirmation} = await invoice.getPaymentConfirmation()

    expect(payment).to.be.equal(null)

    expect(confirmation).to.be.equal(null)

  })

  if (process.env.live_btc_tests_enabled && process.env.wallet_bot_access_token) {

    it('should have a payment but not a confirmation for newly paid invoice', async () => {

      const walletbot = app(process.env.wallet_bot_access_token)

      const {invoice, cancel, refresh} = await anypay.createInvoice([{
        currency: 'BTC',
        chain: 'BTC',
        to: wallets.BTC[0].address,
        amount: {
          value: 10,
          currency: 'EUR'
        }
      }])

      const paymentReceived: Payment = await invoice.awaitPayment()

      // TODO: Actually send payment using local or remote wallet bot

      const {payment, confirmation} = await invoice.getPaymentConfirmation()

      expect(payment.txid).to.be.a('string')

      expect(payment.chain).to.be.equal('BTC')

      expect(payment.currency).to.be.equal('BTC')

      expect(confirmation).to.be.equal(null)

    })

  }

})

