import { io } from 'socket.io-client'

import { EventEmitter } from 'eventemitter3'

import { log } from './log'

/**
 * Subscribe to an invoice by establishing a websocket connection to the server using socket.io
 * and listening for events specifically for this invoice.
 * 
 * @param uid Invoice uid string
 * @returns Promise<EventEmitter> An event emitter that emits events for this invoice
 * @example
 * import { subscribe } from 'anypay'
 *
 * const invoice = await subscribe({ uid: '71d3debf-b828-424c-b7b2-1299107b776' })
 *
 * invoice.on("payment.unconfirmed", payment => { console.log("payment received but not confirmed"})
 *
 * invoice.on("payment.confirmed", payment => { console.log("payment received the required number of confirmations") })
 */
export async function subscribe({ uid }: { uid: string }): Promise<EventEmitter> {

    const events = new EventEmitter()
  
    const socket = io('wss://api.anypayx.com', {
        transports: ['websocket']
    })

    log.debug('socket.connecting', { uid })

    socket.on('connect', () => {

        log.debug('socket.connected', { uid })

        events.emit('socket.connected')

    })

    socket.on('disconnect', (disconnected) => {

        log.debug('socket.disconnected')

        events.emit('socket.disconnected')

    })

    socket.on('reconnect', () => {

        log.debug('socket.reconnect')
    })

    socket.on('connected', () => {

        log.debug('socket.connected')

        events.emit('socket.connected')

    })

    socket.on('*', (data) => {

        try {

        } catch(error) {

            log.debug('socket.data', data)

            events.emit('socket.data', data)
    
            const { type, payload } = data
    
            if (type && payload) {
    
                events.emit(type, payload)
    
            }

        }

    })
  
    return events
  
  }
  