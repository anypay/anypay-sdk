
import * as btc from 'bitcore-lib'

const wallets = {

  "BTC": [{
    "address": new btc.PrivateKey().toAddress().toString()
  }]

}

export { wallets }
