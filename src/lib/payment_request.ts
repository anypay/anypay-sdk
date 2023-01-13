
export interface PaymentRequest {
    uid: string;
    uri: string;
    url: string;
    webpage_url: string;
    status: string;
    template: any;
}

export interface Amount {
    currency: string;
    value: number;
}
    
export interface Template {
    currency: string;
    to: {
        amount: Amount;
        address: string;
    }[];
}

export interface Options {
    template: Template;
    webhook_url?: string;
    redirect_url?: string;
}