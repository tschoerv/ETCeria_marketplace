'use client'
import React, { useState, useEffect } from 'react'
import { useContractRead } from 'wagmi'
import ETCeriaMarketplace_ABI from "../ABI/ETCeria_marketplace_ABI.json";
import { ethers } from 'ethers';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Link } from "@nextui-org/react";
import allTileCoordinatesWithIndices from "../ABI/allTileCoordinatesWithIndices.json";

const columns = [
    { key: 'owner', label: 'Owner' },
    { key: 'tile', label: 'Tile' },
    { key: 'ask', label: 'Ask Price' },
];

export default function Asks({ ownerList, refreshAsksList, marketplaceContract }) {

    const [tileAskList, setTileAskList] = useState([]);
    const [allAsks, setAllAsks] = useState([]);

    const { data: _allAsks } = useContractRead({
        address: marketplaceContract,
        abi: ETCeriaMarketplace_ABI,
        functionName: 'getAsks',
        args: [allTileCoordinatesWithIndices.map(tile => { return tile.tileIndex })],
        watch: true,
        onSuccess(_allAsks) {
            setAllAsks(_allAsks)
        },
    });

    useEffect(() => {
        setTileAskList(allAsks.map((ask, index) => {
            return {
                owner: ownerList[index],
                col: allTileCoordinatesWithIndices[index].col,
                row: allTileCoordinatesWithIndices[index].row,
                ask: ethers.formatEther(ask)
            };
        }).filter(tile => tile.ask > 0)
            .sort((a, b) => parseFloat(a.ask) - parseFloat(b.ask))); // Sort in ascending order
    }, [ownerList, refreshAsksList, allAsks])

    return (
        <div>
            {ownerList.length > 0 ? null : <p style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>...it may take some time to fetch data from the blockchain...</p>}
            <Table topContent="Asks" className='text-center border border-gray-500 rounded-2xl' aria-label="Example table with dynamic content">
                <TableHeader columns={columns}>
                    {(column) => <TableColumn className='bg-red-300' width="auto" key={column.key}>{column.label}</TableColumn>}
                </TableHeader>
                <TableBody emptyContent={"No asks available."} items={tileAskList}>
                    {(item, index) => (
                        <TableRow className='text-left' key={`${item.owner}-${index}`}>
                            {columns.map(column => (
                                <TableCell key={column.key}>
                                    {column.key === 'tile' ? `${item.col},${item.row}` :
                                        column.key === 'owner' ? <Link isExternal color="secondary" href={`https://etc.blockscout.com/address/${item.owner}`} >{item[column.key]}</Link> :
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