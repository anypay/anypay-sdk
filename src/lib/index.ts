
import * as http from 'superagent'

class Anypay {

  apiKey: string

  constructor(apiKey: string) {

    this.apiKey = apiKey
  }

  async requestPayment(details, options = {}) {

    try {

      let resp = await http
        .post(`https://pay.anypayinc.com/r`)
        .auth(this.apiKey, '')

      return resp.body

     } catch(error) {

      console.error(error.message)

      throw error

     }

  }

  async cancel(uid: string) {

  }

  getPaymentRequest(uid: string) {

  }

  letPaymentRequests(options = {}) {

  }

}

export function app(anypay_app_token) {

  return new Anypay(anypay_app_token)

}

class Demo {

  address(currency) {

    switch(currency) {
    case 'BSV':
      return ''
      break
    case 'BCH':
      return ''
      break
    case 'DASH':
      return ''
      break
    case 'BTC':
      return ''
      break
    }
  }

  amount() {
    return 1000
  }
}

const demo = new Demo()

export { demo }

