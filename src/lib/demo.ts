class Demo {

    address(currency) {
  
      switch(currency) {
      case 'BSV':
        return '153QX8cGtiXJdPjRMevWpYdmSPqitb6fQv'
        break
      case 'BCH':
        return 'bitcoincash:qr2wnq2pzyrffwv25d6x9gf5re8p084u05s3nfu8am'
        break
      case 'DASH':
        return 'XhwA3PbbGRZWiicCFiT2t4QPHfpzeP38VG'
        break
      case 'BTC':
        return '1Cfo9eXDbXoPU17E7yJpHG49SYikV47pKN'
        break
      }
    }
  
    amount() {
      return 1000
    }
  }
  
  const demo = new Demo()
  
  export { demo }
  
  