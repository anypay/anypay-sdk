
import { subscribe } from "../src/lib"

import { log } from '../src/lib'

log.setLevel('info')

export async function main() {

    const events = await subscribe({
        uid: process.argv[2] || "qhwo6xVrY"
    })

    events.on('*', ({type, payload}) => {

        log.info('socket.data', { type, payload })

    })

}

main()
