'use client'
import React, { useState, useEffect } from 'react'
import { useAccount, useReadContract, useReadContracts } from "wagmi";
import ETCeriaMarketplace_ABI from "../ABI/ETCeria_marketplace_ABI.json";
import { ethers } from 'ethers';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Link, Spinner } from "@nextui-org/react";
import { useQueryClient } from '@tanstack/react-query'
import { useQueryTrigger } from '../QueryTriggerContext';
import { Web3 } from 'web3';

const columns = [
  { key: 'bidder', label: 'Bidder' },
  { key: 'amount', label: 'Bid Amount' },
  { key: 'type', label: 'Type' },
  { key: 'col', label: 'Column' },
  { key: 'row', label: 'Row' },
  { key: 'elevation', label: 'Elevation' },
  { key: 'water', label: 'Water adj.' },
];

const presetValues = {
  global: [0, 32, 0, 32, 125, 216, 0, 6],
  grassland: [0, 32, 3, 29, 135, 169, 0, 6],
  hill: [0, 32, 0, 32, 170, 199, 0, 6],
  mountain: [0, 32, 0, 32, 200, 216, 0, 6],
  sand: [0, 32, 3, 29, 125, 134, 0, 6],
  northern_tundra: [0, 32, 30, 30, 125, 216, 0, 6],
  southern_tundra: [0, 32, 2, 2, 125, 216, 0, 6],
  northern_ice: [0, 32, 31, 31, 125, 216, 0, 6],
  southern_ice: [0, 32, 1, 1, 125, 216, 0, 6],
  island: [0, 32, 0, 32, 125, 216, 6, 6],
  water_adjacent: [0, 32, 0, 32, 125, 216, 1, 6],
  landlocked: [0, 32, 0, 32, 125, 216, 0, 0],
};

function arraysEqual(a, b) {
  if (a == null || b == null) return false;

  if (a?.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}

function formatAddress(address, length) {
  if(address){
      return address.length > 10 ? `${address.slice(0, length/2)}...${address.slice(-length/2)}` : address;
  }
}

function convertWeb3ArrayToWagmiFormat(web3Outputs) {
  return web3Outputs.map(web3Output => {
    const transformed = [];

    for (let i = 0; i < web3Output.__length__; i++) {
      if (web3Output.hasOwnProperty(i)) {
        const value = web3Output[i];

        if (i === 0) {
          transformed.push(value);
        } else {
          transformed.push(typeof value === 'bigint' ? Number(value) : value);
        }
      }
    }

    return {
      result: transformed
    };
  });
}

export default function Bids({ tableList, setTableList, marketplaceContract }) {
  const [bidders, setBidders] = useState([1]);
  const [bidList, setBidList] = useState([]);
  const [bidType, setBidType] = useState([]);
  const [tableIsLoading, setTableIsLoading] = React.useState(true);
  const { isConnected } = useAccount();

  const { queryTrigger, toggleQueryTrigger } = useQueryTrigger();
  const queryClient = useQueryClient()

  const rivetApiKey = process.env.NEXT_PUBLIC_RIVET_API_KEY;
  const rivetUrl = `https://etc.rpc.rivet.cloud/${rivetApiKey}`;

  const web3 = new Web3(rivetUrl);
  const contract = new web3.eth.Contract(ETCeriaMarketplace_ABI, marketplaceContract);

  const isMobile = window.innerWidth <= 768;

  useEffect(() => {
    const fetchBidders = async () => {
      try {
        if (!isConnected) {
          const biddersData = await contract.methods.getBidders().call()
          setBidders(biddersData);
        }
      } catch (error) {
        console.error('Error fetching bidders:', error);
      }
    };

    fetchBidders();
  }, []);

  const { data: biddersData, isSuccess: isSuccessBiddersData, queryKey: biddersDataQueryKey } = useReadContract({
    address: marketplaceContract,
    abi: ETCeriaMarketplace_ABI,
    functionName: 'getBidders',
  });

  useEffect(() => {
    if (isSuccessBiddersData) {
      setBidders(biddersData)
    }
  }, [biddersData, isSuccessBiddersData]);

  useEffect(() => {
    const fetchBidList = async () => {
      try {
        if (!isConnected && bidders[0] != 1) {
          const allBids = await Promise.all(bidders.map(async (bidder) => {
            const bidListData = await contract.methods.bidOf(bidder).call();
            return bidListData;
          }));
          setBidList(convertWeb3ArrayToWagmiFormat(allBids));
        }

      } catch (error) {
        console.error('Error fetching bid list:', error);
      }
    };

    fetchBidList();
  }, [bidders]);


  const { data: bidListData, isSuccess: isSuccessBidListData, queryKey: bidListDataQueryKey } = useReadContracts({
    contracts:
      bidders.map((tile) => ({
        address: marketplaceContract,
        abi: ETCeriaMarketplace_ABI,
        functionName: 'bidOf',
        args: [tile],
      })),
  });

  useEffect(() => {
    if (isSuccessBidListData) {
      setBidList(bidListData)
    }
  }, [bidListData, isSuccessBidListData]);

  useEffect(() => {
    if (bidders[0] == undefined) {
      setTableIsLoading(false);
      setTableList([]);
      setBidType([]);
    }
  }, [bidders]);

  useEffect(() => {
    if (bidList && bidders[0] != 1) {
      setTableList(bidList.map((item, index) => {
        // Create a copy of the result array and add the new value
        const _tableList = [...item.result ?? [], bidders[index]];

        // Return a new object with the updated result
        return { ...item, result: _tableList };
      }));


      setBidType(bidList.map(bid => {
        const bidInfo = bid.result?.slice(1, 9);

        if (arraysEqual(bidInfo, presetValues.global)) {
          return "Global";
        } else if (arraysEqual(bidInfo, presetValues.grassland)) {
          return "Grassland";
        } else if (arraysEqual(bidInfo, presetValues.hill)) {
          return "Hill";
        } else if (arraysEqual(bidInfo, presetValues.mountain)) {
          return "Mountain";
        } else if (arraysEqual(bidInfo, presetValues.sand)) {
          return "Sand";
        } else if (arraysEqual(bidInfo, presetValues.northern_tundra)) {
          return "Northern Tundra";
        } else if (arraysEqual(bidInfo, presetValues.southern_tundra)) {
          return "Southern Tundra";
        } else if (arraysEqual(bidInfo, presetValues.northern_ice)) {
          return "Northern Ice";
        } else if (arraysEqual(bidInfo, presetValues.southern_ice)) {
          return "Southern Ice";
        } else if (arraysEqual(bidInfo, presetValues.island)) {
          return "Island";
        } else if (arraysEqual(bidInfo, presetValues.water_adjacent)) {
          return "Water Adjacent";
        } else if (arraysEqual(bidInfo, presetValues.landlocked)) {
          return "Landlocked";
        } else {
          return "Custom";
        }
      }));
      setTableIsLoading(false)
    }
  }, [bidList]);


  useEffect(() => {
    queryClient.invalidateQueries({ bidListDataQueryKey })
    queryClient.invalidateQueries({ biddersDataQueryKey })
  }, [queryTrigger]);

  return (
    <div>
      <Table topContent="Bids" className='text-center border border-gray-500 md:rounded-2xl rounded-none md:w-auto w-screen' aria-label="bids table" classNames={{wrapper: "md:rounded-2xl rounded-none"}}>
        <TableHeader columns={columns}>
          {(column) => <TableColumn className='bg-green-300' width="auto" key={column.key}>{column.label}</TableColumn>}
        </TableHeader>
        <TableBody emptyContent={"No bids available."} isLoading={tableIsLoading}
          loadingContent={<Spinner size="md" color="default" label="fetching data from the blockchain..." />}>
          {tableList ? [...tableList] // Create a copy of tableList to avoid mutating the original array
            .sort((a, b) => parseFloat(ethers.formatEther(b.result[0])) - parseFloat(ethers.formatEther(a.result[0]))) // Sort in descending order
            .map((bid, index) => (
              <TableRow className='text-left' key={index}>
                {/* Mapping each value in the bid.result array to a TableCell */}
                <TableCell>
                  <Link isExternal color="secondary" href={`https://etc.blockscout.com/address/${bid?.result[10]}`}>
                    {isMobile ? formatAddress(bid.result[10], 20) : formatAddress(bid.result[10], 26)}
                  </Link>
                </TableCell>
                <TableCell >{(() => {
                  // Convert the value to a number
                  const value = Number(ethers.formatEther(bid?.result[0]));

                  // Check if the number is valid
                  if (!isNaN(value)) {
                    // Limit to 5 digits before the decimal point
                    let limitedValue = value.toFixed(1);
                    if (limitedValue.length > 6) { // 5 digits + decimal point + 1 decimal place
                      limitedValue = limitedValue.slice(0, 6);
                    }

                    // Convert to float and format to at most 1 decimal places
                    return parseFloat(limitedValue).toFixed(1);
                  }

                  // Return the original value if it's not a valid number
                  return ethers.formatEther(bid?.result[0]);
                })()} ETC</TableCell>
                <TableCell>{bidType[index]}</TableCell>
                <TableCell>{bid.result[1]} - {bid.result[2]}</TableCell>
                <TableCell>{bid.result[3]} - {bid.result[4]}</TableCell>
                <TableCell>{bid.result[5]} - {bid.result[6]}</TableCell>
                <TableCell>{bid.result[7]} - {bid.result[8]}</TableCell>
              </TableRow>
            )) : null}
        </TableBody>
      </Table>
    </div>
  )
}