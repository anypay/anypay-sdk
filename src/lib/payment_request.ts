
export interface PaymentRequest {
    uid: string;
    uri: string;
    url: string;
    webpage_url: string;
    status: string;
    template: any;
}

export interface PaymentRequestOptions {
    webhook_url?: string;
    redirect_url?: string;
    secret?: string;
    metadata?: any;
}
