
export interface PaymentOptionData {
  time: string;
  expires: string;
  memo: string;
  paymentUrl: string;
  paymentId: string;
  chain: string;
  network: string;
  instructions: any[];
}

export class PaymentOption {
  uid: string;
  chain: string;
  currency: string;
  data: PaymentOptionData;

  constructor({ uid, chain, currency, data }) {
    this.uid = uid
    this.chain = chain
    this.currency = currency
    this.data = data
  }

}

