'use client'
import React, { useState, useEffect } from 'react'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Link, Spinner } from "@nextui-org/react";
import Web3 from 'web3';
import ETCeriaMarketplace_ABI from "../ABI/ETCeria_marketplace_ABI.json";
import allTileCoordinatesWithIndices from "../ABI/allTileCoordinatesWithIndices.json";
import { useQueryTrigger } from '../QueryTriggerContext';

const columns = [
    { key: 'transactionHash', label: 'Transaction Hash' },
    { key: 'tile', label: 'Tile' },
    { key: 'amount', label: 'Price' },
    
];

function formatHash(hash, length) {
    if(hash){
        return hash.length > 10 ? `${hash.slice(0, length/2)}...${hash.slice(-length/2)}` : hash;
    }
  }

export default function LastSales({ marketplaceContract }) {

    const { queryTrigger, toggleQueryTrigger } = useQueryTrigger();


    const rivetApiKey = process.env.NEXT_PUBLIC_RIVET_API_KEY;
    const rivetUrl = `https://etc.rpc.rivet.cloud/${rivetApiKey}`;

    const web3 = new Web3(rivetUrl);
    const contract = new web3.eth.Contract(ETCeriaMarketplace_ABI, marketplaceContract);

    const [lastSalesList, setLastSalesList] = useState([]);
    const [tableIsLoading, setTableIsLoading] = React.useState(true);

    const isMobile = window.innerWidth <= 768;

    useEffect(() => {
        const fetchBidAcceptedEvents = async () => {
            try {
                const events = await contract.getPastEvents('BidAccepted', {
                    fromBlock: 20724012,
                    toBlock: 'latest'
                });

                const salesData = events.map(event => {
                    const index = Number(event.returnValues.index);
                    const tileData = allTileCoordinatesWithIndices.find(tile => tile.tileIndex === index);
                    
    
                    return {
                        index, 
                        amount: Web3.utils.fromWei(event.returnValues.amount.toString(), 'ether'), // Convert from Wei to ETC
                        transactionHash: event.transactionHash,
                        col: tileData ? tileData.col : null,  // Add col from JSON or null if not found
                        row: tileData ? tileData.row : null   // Add row from JSON or null if not found
                    };
                });
       
                setLastSalesList(salesData.reverse());

            } catch (error) {
                console.error('Error fetching BidAccepted events:', error);
            } finally {
                setTableIsLoading(false)
            }
        };

        fetchBidAcceptedEvents();
    }, [queryTrigger]);

    return (
        <div>
           <Table topContent="Last Sales" className='text-center border border-gray-500 md:rounded-2xl rounded-none md:w-auto w-screen' aria-label="last sales table" classNames={{wrapper: "md:rounded-2xl rounded-none"}}>
                <TableHeader columns={columns}>
                    {(column) => <TableColumn className='bg-orange-300' width="auto" key={column.key}>{column.label}</TableColumn>}
                </TableHeader>
                <TableBody emptyContent={"No last sales available."} items={lastSalesList} isLoading={tableIsLoading}
                    loadingContent={<Spinner className='mt-5' size="md" color="default" label="fetching data from the blockchain..." />}>
                    {(item, index) => (
                        <TableRow className='text-left' key={item.transactionHash}>
                            {columns.map(column => (
                                <TableCell key={column.key}>
                                    {column.key === 'transactionHash' ? <Link isExternal color="secondary" href={`https://etc.blockscout.com/tx/${item.transactionHash}`} >{isMobile ? formatHash(item[column.key], 20) : formatHash(item[column.key], 34)}</Link> :
                                        column.key === 'tile' ? `${item.col},${item.row}` : 
                                            column.key === 'amount' ? `${item[column.key]}\u00A0ETC` :  // Appending " ETC"
                                                item[column.key]}
                                </TableCell>
                            ))}
                        </TableRow>
                    )}
                </TableBody>
            </Table>

        </div>
    )
}
