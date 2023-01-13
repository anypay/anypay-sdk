
import { requestPayment, Wallet } from '../'

async function main() {

    const invoice = await requestPayment({
        template: [{
            currency: 'BSV',
            to: [{
                address: '1F1tAaz5x',
                amount: {
                    currency: 'USD',
                    value: 2.18
                }
            }]
        }],
        webhook_url: 'https://webhook.site/4b3b2b1b-2b1b-4b3b-8b1b-3b1b2b3b1b2b',
    })

    invoice.on('payment', (payment) => {

        console.log('payment received', payment)

    });

    invoice.on('payment.confirming', (payment) => {

        console.log('payment.confirming', payment);

    })

    invoice.on('payment.confirmed', (payment) => {

        console.log('payment.confirmed', payment)
    
    })

    const wallet = new Wallet(/* */);

    const result = await wallet.pay({
        uri: invoice.uri,
        currency: 'BTC'
    })

    console.log('result', result)
    
}

main()
