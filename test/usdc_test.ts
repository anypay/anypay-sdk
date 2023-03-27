
import { request, Invoice } from '../src/lib'

describe('Requesting Payment for USDC', () => {

  it("should create a single output payment request for USDC", async () => {

    let invoice = await request({
      chain: 'MATIC',
      to: '0x66136Fab9a8995c040FAFB2D1a81e84354b14229',
      currency: 'USDC',
      amount: 0.01
    })

    console.log('invoice', invoice)

  })

  it("should request USDC from multiple chains", async () => {

    let invoice = await request([{
      chain: 'MATIC',
      to: '0x66136Fab9a8995c040FAFB2D1a81e84354b14229',
      currency: 'USDC',
      amount: 100
    }, {
      chain: 'MATIC',
      to: '0x66136Fab9a8995c040FAFB2D1a81e84354b14229',
      currency: 'USDC',
      amount: 100
    }, {
      chain: 'AVAX',
      to: '0x66136Fab9a8995c040FAFB2D1a81e84354b14229',
      currency: 'USDC',
      amount: 100
    }, {
      chain: 'SOL',
      to: '0x66136Fab9a8995c040FAFB2D1a81e84354b14229',
      currency: 'USDC',
      amount: 100
    }, {
      chain: 'BSV',
      to: '0x66136Fab9a8995c040FAFB2D1a81e84354b14229',
      currency: 'USDC',
      amount: 100
    }, {
      chain: 'TRON',
      to: '0x66136Fab9a8995c040FAFB2D1a81e84354b14229',
      currency: 'USDC',
      amount: 100
    }, {
      chain: 'XLM',
      to: '0x66136Fab9a8995c040FAFB2D1a81e84354b14229',
      currency: 'USDC',
      amount: 100
    }])

    console.log('invoice', invoice)

  })

})
