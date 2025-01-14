![Anypay Logo](https://bico.media/4f913a35258626de7e07571b0ef8de39e9e77908570a4a4ae2af6072bb34a59d) <!-- Replace with actual logo URL -->

# Anypay SDK For TypeScript 🚀

Welcome to the Anypay SDK for TypeScript! This SDK allows you to easily integrate peer-to-peer payment requests into your application. With Anypay, you can request payments to multiple addresses in various cryptocurrencies, all while ensuring that funds are never held by any third party. 💸

## Features ✨

- **Peer-to-Peer Payments**: Direct payments from the payer's wallet to your desired destination.
- **Multi-Currency Support**: Request payments in multiple cryptocurrencies.
- **Secure Webhooks**: Verify payment notifications with shared secrets.
- **Customizable Metadata**: Add merchant images and other metadata to your payment requests.

## Installation 📦

To use the Anypay SDK, you need to install the `@anypay/client` package. You can do this using npm:

```bash
npm install @anypay/client
```

## Cryptocurrency Payment Requests 💰

Here's how you can request payments in various cryptocurrencies, including stablecoins and popular cryptocurrencies like BTC, DOGE, and BSV:

### Requesting Bitcoin (BTC)

```typescript
import anypay from '@anypay/client';

let paymentRequest = await anypay.request([{
  currency: 'BTC',
  to: [{
    address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    amount: 0.005,
    currency: 'BTC'
  }]
}]);
```

### Stablecoin Payment Requests 🏦

```typescript
import anypay from '@anypay/client';

let paymentRequest = await anypay.request([{
  currency: 'USDT',
  chain: 'ETH',
  to: [{
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    amount: 150.00,
    currency: 'USD'
  }]
}, {
  currency: 'USDC',
  chain: 'ETH',
  to: [{
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606EB48',
    amount: 150.00,
    currency: 'USD'
  }]
}, {
  currency: 'RLUSD',
  chain: 'ETH',
  to: [{
    address: 'rDsbeomae4FXwgQTJp9Rs64Qg9vDiTCdBv',
    amount: 150.00,
    currency: 'USD'
  }]
}, {
  currency: 'RLUSD',
  chain: 'XRP',
  to: [{
    address: 'rDsbeomae4FXwgQTJp9Rs64Qg9vDiTCdBv',
    amount: 150.00,
    currency: 'USD'
  }]
}, {
  currency: 'USD.bs',
  chain: 'XRP',
  to: [{
    address: 'rDsbeomae4FXwgQTJp9Rs64Qg9vDiTCdBv',
    amount: 150.00,
    currency: 'USD'
  }]
}, {
  currency: 'USDT',
  chain: 'SOL',
  to: [{
    address: 'GZ3Z1e5v1e5v1e5v1e5v1e5v1e5v1e5v1e5v1e5v',
    amount: 150.00,
    currency: 'USD'
  }]
}, {
  currency: 'USDC',
  chain: 'SOL',
  to: [{
    address: 'GZ3Z1e5v1e5v1e5v1e5v1e5v1e5v1e5v1e5v1e5v',
    amount: 150.00,
    currency: 'USD'
  }]
}], {
  webhook_url: 'https://ecommerce.mystore.com/anypay-webhooks',
  redirect_url: 'https://mystore.com/checkout-complete/23if3oio',
  secret: 'my-shared-secret-for-webhook-verification',
  metadata: {
    merchantImageUrl: 'https://bico.media/95a49bbd42717a80d6986181a8a9e8ade30fb9284ef0fb81f61a7de6228108d1.jpg'
  }
});
```

### Requesting Dogecoin (DOGE)

```typescript
import anypay from '@anypay/client';

let paymentRequest = await anypay.request([{
  currency: 'DOGE',
  to: [{
    address: 'D7Y55hK1g4Q1z5Q1z5Q1z5Q1z5Q1z5Q1z5Q1z5Q1z5',
    amount: 1000.00,
    currency: 'DOGE'
  }]
}]);
```

### Requesting Bitcoin SV (BSV)

```typescript
import anypay from '@anypay/client';

let paymentRequest = await anypay.request([{
  currency: 'BSV',
  to: [{
    address: '1C9jt1rdpjvhEgT7TirEnxrz2eVpS3vqfZ',
    amount: 52.00,
    currency: 'USD'
  }]
}]);
```

## Payment Request Options ⚙️

When creating a payment request, you can specify several options to customize the behavior and appearance of the payment process:

- **webhook_url**: A URL to receive payment notifications. This allows your application to be notified when a payment is completed.
- **redirect_url**: A URL to redirect the user after the payment is completed. This is useful for returning the user to your application or a confirmation page.
- **secret**: A shared secret used to verify the authenticity of webhook notifications.
- **metadata**: An object containing additional information about the payment request. This can include custom fields such as `merchantImageUrl`, order details, or customer information.

## Get Started Today! 🚀

Integrate Anypay into your application and start accepting payments in minutes. For more information, visit our [documentation](https://docs.anypay.com) or contact our [support team](mailto:support@anypay.com).

---

Thank you for choosing Anypay! We look forward to powering your payment solutions. 😊
