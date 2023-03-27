
export class Payment {

  txid: string;

  timestamp: number;

  chain: string;

  currency: string;

  constructor(data) {

    const { txid, timestamp, chain, currency } = data

    this.txid = txid

    this.timestamp = timestamp

    this.chain = chain

    this.currency = currency

  }

}

