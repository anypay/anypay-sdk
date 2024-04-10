import { z } from "zod"
import { WebSocket } from "ws"
import { EventEmitter } from 'events'

class WebsocketSession extends EventEmitter {
    websocket: WebSocket
    should_close: boolean = false
    props: {
        url: string,
        auth: {
            token: string
        }
    }

    constructor(props: {
        url: string,
        auth: {
            token: string
        }
    }) {

        super()
        
        this.props = props;

        this.open()

    }

    open() {

        this.websocket = new WebSocket(this.props.url, {
            headers: {
                Authorization: `Bearer ${this.props.auth.token}`
            }        
        })

        this.websocket.on('open', () => {        
            this.emit('websocket.connected')
        })

        this.websocket.on('error', (error: Error) => {
            this.emit('websocket.error', error)
        })

        this.websocket.on('message', (event: Event) => {
            this.emit('websocket.message', event)
        })

        this.websocket.on('close', () => {
            this.emit('websocket.disconnected')

            setTimeout(() => {
                if (!this.should_close) {
                    this.emit('websocket.reconnecting')
                    this.open()
                }
            }, 5000)
        })
    }

    close() {
        this.should_close = true
        this.websocket.close()    
    }
    
}

class BaseSubscription {
    session: WebsocketSession;
    options: BaseSubscribeOptions;

    onConnectedHandlers: WebsocketConnectedHandler[] = []
    onDisconnectedHandlers: WebsocketDisconnectedHandler[] = []
    onReconnectingHandlers: WebsocketReconnectingHandler[] = []
    onWebsocketConnectedHandlers: WebsocketSessionConnectedHandler[] = []

    onCloseHandlers: WebsocketCloseHandler[] = []
    onErrorHandlers: ErrorHandler[] = []
    onMessageHandlers: MessageHandler[] = []

    constructor(options: BaseSubscribeOptions) {
        this.options = options
        this.session = new WebsocketSession({
            url: options.websocket?.url || 'wss://wss.anypayx.com',
            auth: {
                token: options.websocket?.auth.token
            }
        })
        this.session.on('websocket.connected', () => {
            this.onConnectedHandlers.forEach(handler => handler())
        })
        this.session.on('websocket.disconnected', () => {
            this.onDisconnectedHandlers.forEach(handler => handler())
        })
        this.session.on('websocket.error', (error) => {
            this.onErrorHandlers.forEach(handler => handler(error))
        })
        this.session.on('websocket.message', (message) => {
            this.onMessageHandlers.forEach(handler => handler(message))
        })
    }

    onMessage(handler: MessageHandler) {
        this.onMessageHandlers.push(handler)
        return this
    }
    
    onError(handler: ErrorHandler) {
        this.onErrorHandlers.push(handler)
        return this
    }

    onConnected(handler: WebsocketConnectedHandler) {
        this.onConnectedHandlers.push(handler)
        return this
    }

    onWebsocketConnected(handler: WebsocketSessionConnectedHandler) {
        this.onWebsocketConnectedHandlers.push(handler)
        return this
    }

    onDisconnected(handler: WebsocketDisconnectedHandler) {
        this.onDisconnectedHandlers.push(handler)
        return this
    }

    onReconnecting(handler: WebsocketReconnectingHandler) {
        this.onReconnectingHandlers.push(handler)
        return this
    }

    onClose(handler: WebsocketCloseHandler) {
        this.onCloseHandlers.push(handler)
        return this
    }
}

type Event = events.Any & {
    topic: string;
    payload: any;
}

type WebsocketConnectedHandler = () => void;
type WebsocketDisconnectedHandler = () => void;
type WebsocketReconnectingHandler = () => void;
type WebsocketCloseHandler = () => void;
type InvoicePaidHandler = (event: events.InvoicePaidEvent) => void;
type InvoiceCreatedHandler = (event: events.InvoiceCreatedEvent) => void;
type InvoiceCancelledHandler = (event: events.InvoiceCancelledEvent) => void;
type PaymentConfirmingHandler = (event: events.PaymentConfirmingEvent) => void;
type PaymentConfirmedHandler = (event: events.PaymentConfirmedEvent) => void;
type PaymentFailedHandler = (event: events.PaymentFailedEvent) => void;
type WebsocketSessionConnectedHandler = (event: events.WebsocketConnectedEvent) => void;
type ErrorHandler = (error: Error) => void;
type MessageHandler = (buffer: Buffer) => void;

class AppSubscription extends BaseSubscription {  
    invoicePaidHandlers: InvoicePaidHandler[] = []
    invoiceCreatedHandlers: InvoiceCreatedHandler[] = []
    invoiceCancelledHandlers: InvoiceCancelledHandler[] = []
    paymentConfirmingHandlers: PaymentConfirmingHandler[] = []
    paymentConfirmedHandlers: PaymentConfirmedHandler[] = []
    paymentFailedHandlers: PaymentFailedHandler[] = []
    errorHandlers: ErrorHandler[] = []

    constructor(options: AppSubscribeOptions) {
        super(options)

        this.onMessage((buffer: Buffer) => {
            try { 
                const message = JSON.parse(buffer.toString())

                switch(message.topic) {
                    case 'invoice.paid':
                        this.invoicePaidHandlers.forEach(handler => handler(message))
                        break
                    case 'invoice.created':
                        this.invoiceCreatedHandlers.forEach(handler => handler(message))
                        break
                    case 'invoice.cancelled':
                        this.invoiceCancelledHandlers.forEach(handler => handler(message))
                        break
                    case 'payment.confirming':
                        this.paymentConfirmingHandlers.forEach(handler => handler(message))
                        break
                    case 'payment.confirmed':
                        this.paymentConfirmedHandlers.forEach(handler => handler(message))
                        break
                    case 'payment.failed':
                        this.paymentFailedHandlers.forEach(handler => handler(message))
                        break
                    case 'websocket.connected':
                        this.onWebsocketConnectedHandlers.forEach(handler => handler(message))
                        break
                }

            } catch(error) {

                this.onErrorHandlers.forEach(handler => handler(error as Error))
            }

        })
    }

    onInvoicePaid(handler: InvoicePaidHandler) {
        this.invoicePaidHandlers.push(handler)
        return this
    }

    onInvoiceCreated(handler: InvoiceCreatedHandler) {
        this.invoiceCreatedHandlers.push(handler)
        return this
    }

    onInvoiceCancelled(handler: InvoiceCancelledHandler) {
        this.invoiceCancelledHandlers.push(handler)
        return this
    }

    onPaymentConfirming(handler: PaymentConfirmingHandler) {
        this.paymentConfirmingHandlers.push(handler)
        return this
    }

    onPaymentConfirmed(handler: PaymentConfirmedHandler) {
        this.paymentConfirmedHandlers.push(handler)
        return this
    }

    onPaymentFailed(handler: PaymentFailedHandler) {
        this.paymentFailedHandlers.push(handler)
        return this
    }
}

interface BaseSubscribeOptions {
    websocket: {
        url?: string,
        auth: {
            token: string
        }
    }
}

interface AppSubscribeOptions extends BaseSubscribeOptions {

}

interface AccountSubscribeOptions extends BaseSubscribeOptions {

}

interface InvoiceSubscribeOptions extends BaseSubscribeOptions {
    invoice: {
        uid: string;
        auth: {
            token: string
        }
    }
}

export type SubscribeOptions = AppSubscribeOptions | AccountSubscribeOptions | InvoiceSubscribeOptions | BaseSubscription;

export function subscribe(
    options: SubscribeOptions
): AppSubscription {

    return new AppSubscription(options as AppSubscribeOptions)

}

export namespace events {

    const PaymentFailedEvent = z.object({
        topic: z.string().regex(/payment.failed/),
        payload: z.object({
          account_id: z.number().optional(),
          app_id: z.number().optional(),
          invoice: z.object({
            uid: z.string(),
            status: z.string().regex(/unpaid/),
          }),
          payment: z.object({
            chain: z.string(),
            currency: z.string(),
            txid: z.string(),
            status: z.string().regex(/failed/)
          })
        })
      })
      
    export type PaymentFailedEvent = z.infer<typeof PaymentFailedEvent>

    const InvoicePaidEvent = z.object({
        topic: z.string().regex(/invoice.paid/),
        payload: z.object({
          account_id: z.number().optional(),
          app_id: z.number().optional(),
          invoice: z.object({
            uid: z.string(),
            status: z.string().regex(/paid/),
          }),
          payment: z.object({
            chain: z.string(),
            currency: z.string(),
            txid: z.string(),
            status: z.string()
          })
        })
      })
      
    export type InvoicePaidEvent = z.infer<typeof InvoicePaidEvent>

    const InvoiceCreatedEvent = z.object({
        topic: z.string().regex(/invoice.created/),
        payload: z.object({
          account_id: z.number().optional(),
          app_id: z.number().optional(),
          invoice: z.object({
            uid: z.string(),
            status: z.string().regex(/unpaid/),
            quote: z.object({
              value: z.number(),
              currency: z.string()
            }),
          })
        })
      })
      
    export type InvoiceCreatedEvent = z.infer<typeof InvoiceCreatedEvent>
    
    const InvoiceCancelledEvent = z.object({
        topic: z.string().regex(/invoice.created/),
        payload: z.object({
          account_id: z.number().optional(),
          app_id: z.number().optional(),
          invoice: z.object({
            uid: z.string(),
            status: z.string().regex(/cancelled/),
          })
        })
      })
      
    export type InvoiceCancelledEvent = z.infer<typeof InvoiceCancelledEvent>
        
    const PaymentConfirmingEvent = z.object({
        topic: z.string().regex(/payment.confirming/),
        payload: z.object({
            account_id: z.number().optional(),
            app_id: z.number().optional(),
            invoice: z.object({
                uid: z.string(),
                status: z.string().regex(/confirming/)
            }),
            payment: z.object({
                chain: z.string(),
                currency: z.string(),
                txid: z.string(),
                status: z.string().regex(/confirming/)
            })
        })
    })

    export type PaymentConfirmingEvent = z.infer<typeof PaymentConfirmingEvent>

    const PaymentConfirmedEvent = z.object({
        topic: z.string().regex(/payment.confirmed/),
        payload: z.object({
          account_id: z.number().optional(),
          app_id: z.number().optional(),
          invoice: z.object({
            uid: z.string(),
            status: z.string().regex(/paid/),
          }),
          payment: z.object({
            chain: z.string(),
            currency: z.string(),
            txid: z.string(),
            status: z.string().regex(/confirmed/)
          }),
          confirmation: z.object({
            hash: z.string(),
            height: z.number()
          })
        })
      })
      
      export type PaymentConfirmedEvent = z.infer<typeof PaymentConfirmedEvent>

    const WebsocketConnectedEvent = z.object({
        topic: z.string().regex(/websocket.connected/),
        payload: z.object({
            uid: z.string()
        })
    })

    export type WebsocketConnectedEvent = z.infer<typeof WebsocketConnectedEvent>
    
      export type Any =
        InvoicePaidEvent |
        InvoiceCreatedEvent |
        InvoiceCancelledEvent |
        PaymentConfirmingEvent |
        PaymentConfirmedEvent |
        PaymentFailedEvent |
        WebsocketConnectedEvent;
    
}

