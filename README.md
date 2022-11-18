
# Anypay SDK For Typescript

## Payment Requests

You may request payment to any one or more addresses.

All payments are directly peer to peer meaning anypay
never receives nor possesses your funds, nor does any
other third party. All payments go directly to your desired
destination from the payer's wallet.

```
import anypay from 'anypay'

let paymentRequest = await anypay.request([{

  currency: 'BSV'

  to: [{
    address: '1C9jt1rdpjvhEgT7TirEnxrz2eVpS3vqfZ',
    amount: 52.00
    currency: 'USD'
  }, {
    address: '123AeiwXiYswoNrNRCvPekkKJYvoUzyxbC',
    amount: 8.00
    currency: 'USD'
  }]

}])
```

## Multi-Coin Requests

```
import anypay from 'anypay'

let paymentRequest = await anypay.request([{

  currency: 'BSV'

  to: [{
    address: '123AeiwXiYswoNrNRCvPekkKJYvoUzyxbC',
    amount: 5200,
    currency: 'ARS'
  }]

}, {

  currency: 'BCH',

  to: [{
    address: 'bitcoincash:qz0umvn625yf3yqc3z0zzs86fly7ue7ejs0dkzrrak',
    amount: 2600,
    currency: 'ARS'
  }, {
    address: 'bitcoincash:qz0umvn625yf3yqc3z0zzs86fly7ue7ejs0dkzrrak',
    amount: 2600,
    currency: 'ARS'
  }]

}])

```
