
import { EventEmitter } from "events";

import { PaymentRequest } from "./payment_request";

import fetch from 'axios'

const API_BASE = `https://api.anypayx.com//invoices`

const URI_BASE = `pay:?r=https://api.anypayx.com/i`

interface InvoiceOptions {
    paymentRequest?: PaymentRequest
}

export class Invoice extends EventEmitter {

    uid: string;

    paymentRequest: PaymentRequest;

    invoiceData: any;

    constructor(uid: string, options: InvoiceOptions = {}) {
        super()

        this.uid = uid
    }

    static fromPaymentRequest(paymentRequest: PaymentRequest): Invoice {

        const invoice = new Invoice(paymentRequest.uid)

        invoice.paymentRequest = paymentRequest

        return invoice
    }

    async fetch(apiBase: string = API_BASE) {

        const { data } = await fetch(`${apiBase}/${this.uid}`)

        this.paymentRequest = data

    }

    get uri() {

        const uriBase: string = URI_BASE

        return `${uriBase}/${this.uid}`
    }

    get status() {
        return this.invoiceData.status
    }

}
