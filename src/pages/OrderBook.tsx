import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import Subscribe from '../api/Subscribe'
import Footer from '../components/Footer'
import Header from '../components/Header'

import {
    OrderBookData,
    OrderBookDataArray,
    OrderBookDeltas,
    OrderBookEntries,
    WebSocketMessageData,
    OrderBookEntry
} from '../type'

interface StyledEntryProps {
    isBids?: Boolean
}

const OrderBook: React.FC = () => {
    const [bids, setBids] = useState(new Array<OrderBookEntry>())
    const [asks, setAsks] = useState(new Array<OrderBookEntry>())
    const bidsMap: OrderBookData = new Map();
    const asksMap: OrderBookData = new Map();

    useEffect(() => {
        Subscribe("PI_XBTUSD", (orders) => {
                const dataObj: WebSocketMessageData = orders;
                const { bids: newBids, asks: newAsks } = dataObj;

                updateOrderBookEntries(asksMap, newBids);
                updateOrderBookEntries(bidsMap, newAsks);

                const asksArray: OrderBookDataArray = Array.from(asksMap);
                const bidsArray: OrderBookDataArray = Array.from(bidsMap);
        
                const asksSortedArray = sortLowestOrderBookData(asksArray);
                const bidsSortedArray = sortHighestOrderBookData(bidsArray);
        
                const asks = getOrderBookEntries(asksSortedArray);
                const bids = getOrderBookEntries(bidsSortedArray);
        
                const maxSizeTotal = Math.max(
                    ...[...asks, ...bids].map(({ total }) => total),
                );
        
                updateOrderBookEntriesBars(asks, maxSizeTotal);
                updateOrderBookEntriesBars(bids, maxSizeTotal);
                setAsks(asks.slice(0, 24))
                setBids(bids.slice(0, 24))
        })
    }, [])

    const updateOrderBookEntriesBars = (
        orderBookEntries: OrderBookEntries,
        maxSizeTotal: number,
    ) => {
        orderBookEntries.forEach((orderBookEntry) => {
            orderBookEntry.barWidth = (orderBookEntry.total * 100) / maxSizeTotal;
        });
    };
    
    const updateOrderBookEntries = (
        oldEntries: OrderBookData,
        newEntries: OrderBookDeltas,
    ) => {
        newEntries && newEntries.forEach(([price, size]) => {
            if (size === 0) {
                oldEntries.delete(price);
    
                return;
            }
            
            oldEntries.set(price, size);
        });
    };
    
    const sortLowestOrderBookData = (orderBookData: OrderBookDataArray) => {
        return orderBookData.sort(
            ([orderBookPrice], [compareOrderBookPrice]) =>
                orderBookPrice - compareOrderBookPrice,
        );
    };
    const sortHighestOrderBookData = (orderBookData: OrderBookDataArray) => {
        return orderBookData.sort(
            ([orderBookPrice], [compareOrderBookPrice]) =>
                compareOrderBookPrice - orderBookPrice,
        );
    };
    
    const getOrderBookEntries = (orderBookData: OrderBookDataArray) => {
        return orderBookData.reduce(
            (
                orderBookEntriesAccumulator,
                [orderBookDataPrice, orderBookDataSize],
                orderBookDataIndex,
            ) => {
                const previousLevel =
                    orderBookEntriesAccumulator[orderBookDataIndex - 1] ?? null;
                const previousTotal = previousLevel?.total ?? 0;
    
                const price = orderBookDataPrice;
                const size = orderBookDataSize;
                const total = orderBookDataSize + previousTotal;
    
                orderBookEntriesAccumulator.push({
                    total,
                    size,
                    price,
                    barWidth: 0,
                });
    
                return orderBookEntriesAccumulator;
            },
            [] as OrderBookEntries,
        );
    }
    
   
    return (
        <div>
            <Header />
            <OrderBookContainer>
                {/* bid table */}
                <Table>
                    <TableHeader>
                        <HeaderCell><span>TOTAL</span></HeaderCell>
                        <HeaderCell><span>SIZE</span></HeaderCell>
                        <HeaderCell><span>PRICE</span></HeaderCell>
                    </TableHeader>
                    <TableBody>
                        {bids && bids.map((bid, index) => {
                            return  <TableRow key={index} isBids={true}>
                                        <RowCell><span>{bid.total}</span></RowCell>
                                        <RowCell><span>{bid.size}</span></RowCell>
                                        <BidPriceCell><span>{bid.price}</span></BidPriceCell>
                                        <svg
                                            width="50vw"
                                            height={`${100 / bids.length}vh`}
                                            preserveAspectRatio="none"
                                            viewBox="0 0 100 100"
                                            role="img"
                                        >                                           
                                            <rect
                                                key={index}
                                                width={`${bid.barWidth}%`}
                                                height="100%"
                                                fill="#0a3b2d"
                                                x={`${100 - bid.barWidth}`}
                                                y={index}
                                            ></rect>
                                        </svg>
                                    </TableRow>
                        })}
                        
                    </TableBody>
                </Table>
                {/* ask table */}
                <Table>
                    <TableHeader>
                        <HeaderCell><span>PRICE</span></HeaderCell>
                        <HeaderCell><span>SIZE</span></HeaderCell>
                        <HeaderCell><span>TOTAL</span></HeaderCell>
                    </TableHeader>
                    <TableBody>
                        {asks && asks.map((ask, index) => {
                           return   <TableRow key={index} isBids={false}>
                                        <AskPriceCell><span>{ask.price}</span></AskPriceCell>
                                        <RowCell><span>{ask.size}</span></RowCell>
                                        <RowCell><span>{ask.total}</span></RowCell>
                                        <svg
                                            width="50vw"
                                            height={`${100 / asks.length}vh`}
                                            preserveAspectRatio="none"
                                            viewBox="0 0 100 100"
                                            role="img"
                                        >                                           
                                            <rect
                                                key={index}
                                                width={`${ask.barWidth}%`}
                                                height="100%"
                                                fill="#3f192b"
                                                x="0"
                                                y={index}
                                            ></rect>
                                        </svg>
                                    </TableRow>
                        })}
                    </TableBody>
                </Table>
            </OrderBookContainer>
            <Footer />
        </div>
    )
}

export default OrderBook

const OrderBookContainer = styled.div`
    display: flex;
`;

const Table = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 50vw;
`;
const TableHeader = styled.div`
    display: flex;
    width: 50vw;
    height: 50px;
    border-bottom: 1px solid #6b6a68;
`;
const TableBody = styled.div`
    display: flex;
    width: 50vw;
    flex-direction: column;
`;
const TableRow = styled.div<StyledEntryProps>`
    display: flex;
    width: 100%;
    height: 2.8vh;
    svg {
        position: absolute;
        z-index: -5;
    }
`;
const HeaderCell = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 16vw;
    color: #6b6a68;
    span {
        display: flex;
        width: 6vw;
        justify-content: right;
    }
`;
const RowCell = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 16vw;
    height: 3vh;
    color: white;
    span {
        display: flex;
        width: 6vw;
        justify-content: right;
    }
`;
const BidPriceCell = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 16vw;
    height: 3vh;
    color: #12873b;   
    span {
        display: flex;
        width: 6vw;
        justify-content: right;
    }
`;
const AskPriceCell = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 16vw;
    height: 3vh;
    color: #a1154d;   
    span {
        display: flex;
        width: 6vw;
        justify-content: right;
    }
`;

