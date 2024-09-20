'use client'
import React, { useState, useEffect } from 'react'
import { useReadContract, useAccount } from "wagmi";
import ETCeriaMarketplace_ABI from "../ABI/ETCeria_marketplace_ABI.json";
import { ethers } from 'ethers';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Link, Spinner } from "@nextui-org/react";
import allTileCoordinatesWithIndices from "../ABI/allTileCoordinatesWithIndices.json";
import { useQueryClient } from '@tanstack/react-query'
import { useQueryTrigger } from '../QueryTriggerContext';
import { Web3 } from 'web3';

const columns = [
    { key: 'owner', label: 'Owner' },
    { key: 'tile', label: 'Tile' },
    { key: 'ask', label: 'Ask Price' },
];

function formatAddress(address, length) {
    if (address) {
        return address.length > 10 ? `${address.slice(0, length / 2)}...${address.slice(-length / 2)}` : address;
    }
}

export default function Asks({ ownerList, marketplaceContract }) {

    const { queryTrigger, toggleQueryTrigger } = useQueryTrigger();

    const [tileAskList, setTileAskList] = useState([]);
    const [allAsksList, setAllAsksList] = useState([1]);
    const [tableIsLoading, setTableIsLoading] = React.useState(true);

    const queryClient = useQueryClient()

    const rivetApiKey = process.env.NEXT_PUBLIC_RIVET_API_KEY;
    const rivetUrl = `https://etc.rpc.rivet.cloud/${rivetApiKey}`;

    const web3 = new Web3(rivetUrl);
    const contract = new web3.eth.Contract(ETCeriaMarketplace_ABI, marketplaceContract);

    const isMobile = window.innerWidth <= 768;

    const { isConnected } = useAccount();


    useEffect(() => {
        const fetchAsks = async () => {
            try {
                if (!isConnected) {
                    const asks = await contract.methods.getAsks(allTileCoordinatesWithIndices.map(tile => { return tile.tileIndex })).call()
                    setAllAsksList(asks);
                }
            } catch (error) {
                console.error('Error fetching asks:', error);
            }
        };

        fetchAsks();
    }, []);

    const { data: readAllAsks, isSuccess: isSuccessReadAllAsks, error: errorAsks, queryKey: allAsksQueryKey } = useReadContract({
        address: marketplaceContract,
        abi: ETCeriaMarketplace_ABI,
        functionName: 'getAsks',
        args: [allTileCoordinatesWithIndices.map(tile => { return tile.tileIndex })],
    });

    useEffect(() => {
        if (isSuccessReadAllAsks) {
            setAllAsksList(readAllAsks);
        }
    }, [readAllAsks, isSuccessReadAllAsks]);

    useEffect(() => {
        if (allAsksList[0] != 1) {
            setTileAskList(allAsksList.map((ask, index) => {
                return {
                    owner: ownerList[index],
                    col: allTileCoordinatesWithIndices[index].col,
                    row: allTileCoordinatesWithIndices[index].row,
                    ask: ethers.formatEther(ask)
                };
            }).filter(tile => parseFloat(tile.ask) > 0 && tile.owner) // Check for valid ask and owner
                .sort((a, b) => parseFloat(a.ask) - parseFloat(b.ask)));
            setTableIsLoading(false);
        }
    }, [allAsksList, ownerList]);

    useEffect(() => {
        queryClient.invalidateQueries({ allAsksQueryKey })
    }, [queryTrigger]);


    return (
        <div>
            <Table topContent="Asks" className='text-center border border-gray-500 md:rounded-2xl rounded-none md:w-auto w-screen' aria-label="asks table" classNames={{wrapper: "md:rounded-2xl rounded-none"}}>
                <TableHeader columns={columns}>
                    {(column) => <TableColumn className='bg-red-300' width="auto" key={column.key}>{column.label}</TableColumn>}
                </TableHeader>
                <TableBody emptyContent={"No asks available."} items={tileAskList} isLoading={tableIsLoading}
                    loadingContent={<Spinner className='mt-5' size="md" color="default" label="fetching data from the blockchain..." />}>
                    {(item, index) => (
                        <TableRow className='text-left' key={`${item.col}-${item.row}-${index}`}>
                            {columns.map(column => (
                                <TableCell key={column.key}>
                                    {column.key === 'tile' ? `${item.col},${item.row}` :
                                        column.key === 'owner' ? <Link isExternal color="secondary" href={`https://etc.blockscout.com/address/${item.owner}`} >{isMobile ? formatAddress(item[column.key], 20) : formatAddress(item[column.key], 26)}</Link> :
                                            column.key === 'ask' ? `${item[column.key]} ETC` :  // Appending " ETC"
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