
export enum Product {
    PI_XBTUSD = 'PI_XBTUSD',
    PI_ETHUSD = 'PI_ETHUSD',
}

export type OrderBookEntry = {
    price: number;
    size: number;
    barWidth: number;
    total: number;
};

export type OrderBookEntries = Array<OrderBookEntry>;

export type OrderBookData = Map<number, number>;

export type OrderBookDataArray = Array<[number, number]>;

export type OrderBookDeltas = Array<[number, number]>;

export type WebSocketMessageData = {
    asks: OrderBookDeltas;
    bids: OrderBookDeltas;
};

