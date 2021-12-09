import emitError from './emitError';

export default function UnSubscribe(feed: string){
    const url = 'wss://www.cryptofacilities.com/ws/v1';

    const unSubscribe = {
        event: 'unsubscribe',
        feed: 'book_ui_1',
        product_ids: [feed]
    }

    let webSocket = new WebSocket(url);
    webSocket.addEventListener('open', () => {
        webSocket.send(JSON.stringify(unSubscribe))
    })
    webSocket.addEventListener('message', (event: MessageEvent<string>) => {
        try {
            console.log(event)
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error('Unable to parse data', e);
            emitError(e as Error);
        }
        webSocket.close()
    })
      
}