'use client'
import React, { useState, useEffect } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import SetAsk from "../Components/SetAsk";
import Bidding from "../Components/Bidding";
import Asks from "../Components/Asks";
import Bids from "../Components/Bids";
import LastSales from "../Components/LastSales";
import { useWriteContract, useWaitForTransactionReceipt, useSimulateContract, useSwitchChain, useAccount, useReadContract } from "wagmi";
import ETCeriaMarketplace_ABI from "../ABI/ETCeria_marketplace_ABI.json";
import { Link, Button } from "@nextui-org/react";
import { useQueryClient } from '@tanstack/react-query'
import { useQueryTrigger } from '../QueryTriggerContext';
import Web3 from "web3";
import Image from 'next/image';


export default function Marketplace1pt1() {

  const { queryTrigger, toggleQueryTrigger } = useQueryTrigger();

  const [withdrawableFunds, setWithdrawableFunds] = useState("");
  const [ownerList, setOwnerList] = useState([]);
  const [bidTableList, setBidTableList] = useState([]);
  const [flexDirection, setFlexDirection] = useState('row'); // default to row
  const [isDisabled, setIsDisabled] = useState(false);
  const [isClientSide, setIsClientSide] = useState(false);
  const queryClient = useQueryClient()

  const ETCeriaMP1pt1_address = process.env.NEXT_PUBLIC_ETCERIA_MARKETPLACE_ADDRESS_V1PT1;

  const { isConnected, chain, address } = useAccount();

  const { switchChain } = useSwitchChain();
  const desiredNetworkId = 61; // Chain ID for Ethereum Classic

  useEffect(() => {
    document.title = 'ETCeria Marketplace v1.1';
  }, []);

  useEffect(() => {
    setIsClientSide(true); // Set to true once the component has mounted on the client
  }, []);

  const handleSwitchChain = () => {
    switchChain({ chainId: desiredNetworkId });
  };

  useEffect(() => {
    if (chain?.id !== desiredNetworkId) {
      setIsDisabled(true);
    }
    else {
      setIsDisabled(false);
    }
  }, [chain]);


  const { data: readWithdrawableFunds, isSuccess: isSuccessReadWithdrawableFunds, queryKey: withdrawableFundsQueryKey } = useReadContract({
    address: ETCeriaMP1pt1_address,
    abi: ETCeriaMarketplace_ABI,
    functionName: 'pendingWithdrawalOf',
    args: [address],
  });

  useEffect(() => {
    if (isSuccessReadWithdrawableFunds) {
      setWithdrawableFunds((Math.floor(Number(Web3.utils.fromWei(readWithdrawableFunds, 'ether')) * 10) / 10).toFixed(1));
    }
  }, [readWithdrawableFunds, isSuccessReadWithdrawableFunds]);

  const { data: simulateWithdraw } = useSimulateContract({
    address: ETCeriaMP1pt1_address,
    abi: ETCeriaMarketplace_ABI,
    functionName: 'withdraw',
  });
  const { writeContract: withdraw, data: withdrawHash } = useWriteContract();

  const { isSuccess: withdrawConfirmed } =
    useWaitForTransactionReceipt({
      hash: withdrawHash,
    })

  useEffect(() => {
    if (withdrawConfirmed) {
      toggleQueryTrigger();
    }
  }, [withdrawConfirmed]);


  useEffect(() => {
    queryClient.invalidateQueries({ withdrawableFundsQueryKey })
  }, [queryTrigger]);



  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 769) {
        setFlexDirection('row'); // large screens
      } else {
        setFlexDirection('column'); // smaller screens
      }
    };

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Call handler to set initial state
    handleResize();

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', justifyContent: 'space-between' }} >
      <div className={"logo"}>
        <Link href="/">
          <Image
            src="/logo.png"
            width={450}
            height={244}
            alt="logo"
            priority={true}
          />
        </Link>
      </div>
      <div>
        <div className='marktplaceTitle'>
          <h1 className='text-center text-2xl'>Marketplace v1.1</h1>
          <h2 className='text-center'>0% fee</h2></div>


        {/* Main flex container for two columns */}
        <div style={{ display: 'flex', flexDirection: flexDirection, justifyContent: 'center', alignItems: 'center' }}>

          {/* Left column: Centered stack and SetAsk */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} className='md:mr-2 mr-0'>
            {/* Centered stack */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }} className="componentBackground1 m-3 p-6 text-left text-inherit no-underline border border-black rounded-lg max-w-xs">
              {isClientSide && (
                <>
                  {chain?.id !== desiredNetworkId && isConnected ?
                    <Button variant="solid" color="danger" onClick={handleSwitchChain}>Switch to Ethereum Classic</Button> :
                    <ConnectButton chainStatus="none" showBalance={false} />
                  }
                </>
              )}
              {withdrawableFunds > 0 && isConnected ?
                <Button variant="faded" onClick={() => withdraw(simulateWithdraw?.request)} className='mt-3'>Withdraw {withdrawableFunds} ETC</Button> :
                <Button variant="faded" isDisabled={true} className='mt-3'>Withdraw</Button>
              }
            </div>
            <div className="componentBackground2 md:m-3 m-0 text-left text-inherit no-underline border border-black rounded-lg max-w-xs">
              <SetAsk ownerList={ownerList} setOwnerList={setOwnerList} bidTableList={bidTableList} marketplaceContract={ETCeriaMP1pt1_address} isDisabled={isDisabled} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} className="componentBackground3 m-3 md:ml-2 ml-0 text-left text-inherit no-underline border border-black rounded-lg max-w-xs">
            <Bidding marketplaceContract={ETCeriaMP1pt1_address} isDisabled={isDisabled} />
          </div>
        </div>
        <div className='flex justify-center'>
          <Asks ownerList={ownerList} marketplaceContract={ETCeriaMP1pt1_address} />
        </div>
        <div className='flex justify-center my-3'>
          <Bids tableList={bidTableList} setTableList={setBidTableList} marketplaceContract={ETCeriaMP1pt1_address} />
        </div>
        <div className='flex justify-center mb-5'>
          <LastSales marketplaceContract={ETCeriaMP1pt1_address} />
        </div>
      </div>
      <footer className={"footer"}>
        <div><Link isExternal color="secondary" href={`https://etc.blockscout.com/address/${ETCeriaMP1pt1_address}`}>
          ETCeria v1.1 Marketplace Contract</Link></div>
        <div><p>
          <Link isExternal color="secondary" href={`https://github.com/tschoerv/ETCeria_marketplace`}>Made</Link> by <Link isExternal color="secondary" href={`https://x.com/tschoerv`}>tschoerv.eth</Link> - donations welcome
        </p></div>
      </footer>
    </div>


  )

}
