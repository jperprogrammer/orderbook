import emitError from './emitError';

export default function Subscribe(
    feed: string, callback: (orders: any) => void,
): () => void {
    const url = 'wss://www.cryptofacilities.com/ws/v1';

    const subscribe = {
        event: 'subscribe',
        feed: 'book_ui_1',
        product_ids: [feed]
    }

    let webSocket = new WebSocket(url);
  
    let isClosed = false;
  
    const addEvents = (ws: WebSocket) => {
      ws.addEventListener('error', (event) => {
        if (!isClosed) {
          // eslint-disable-next-line no-console
          console.error('Connection error', event, ws.readyState);
          emitError(`Connection error ${url}`);
        }
      });

      ws.addEventListener('open', () => {
        ws.send(JSON.stringify(subscribe))
      })
  
      ws.addEventListener('message', (event: MessageEvent<string>) => {
        let orders = null;
  
        try {
            orders = JSON.parse(event.data);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error('Unable to parse data', e);
          emitError(e as Error);
        }
  
        if (orders) {
          try {
            callback(orders);
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error('Unable to call callback', e);
          }
        }
      });
  
      ws.addEventListener('close', () => {
        if (!isClosed) {
          webSocket = new WebSocket(url);
          addEvents(webSocket);
        }
      });
    };
  
    addEvents(webSocket);
  
    return () => {
      isClosed = true;
      webSocket.close();
    };
}