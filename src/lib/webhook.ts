
export type PaymentRequestStatus = 'unpaid' | 'confirming' | 'paid' | 'cancelled'

export interface PaymentRequestWebhook {
    uid: string;
    status: PaymentRequestStatus;
    hash?: string;
}
