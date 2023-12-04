'use client'
import React, { useState, useEffect } from 'react'
import Head from 'next/head';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Bidding from "../Components/Bidding";
import Asks from "../Components/Asks";
import SetAsk from "../Components/SetAsk";
import Bids from "../Components/Bids";
import { usePrepareContractWrite, useContractWrite, useNetwork, useSwitchNetwork, useContractRead, useAccount } from "wagmi";
import ETCeriaMarketplace_ABI from "../ABI/ETCeria_marketplace_ABI.json";
import { ethers } from 'ethers';
import { Link, Button } from "@nextui-org/react";


export default function marketplace1pt1() {

  const [withdrawableFunds, setWithdrawableFunds] = useState("");
  const [ownerList, setOwnerList] = useState([]);
  const [refreshAsksList, setRefreshAsksList] = useState(0);
  const [refreshBidsList, setRefreshBidsList] = useState(0);
  const [bidTableList, setBidTableList] = useState([]);
  const [flexDirection, setFlexDirection] = useState('row'); // default to row
  const [isDisabled, setIsDisabled] = useState(false);
  const [isClientSide, setIsClientSide] = useState(false);

  const ETCeriaMP1pt2_address = process.env.NEXT_PUBLIC_ETCERIA_MARKETPLACE_ADDRESS_V1PT2;

  const { address, isConnected } = useAccount();

  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  const desiredNetworkId = 61; // Chain ID for Ethereum Classic


  useEffect(() => {
    document.title = 'ETCeria Marketplace v1.2';
  }, []);

  useEffect(() => {
    setIsClientSide(true); // Set to true once the component has mounted on the client
  }, []);

  const handleSwitchNetwork = () => {
    if (switchNetwork) {
      switchNetwork(desiredNetworkId);
    }
  };

  useEffect(() => {
    if(chain?.id !== desiredNetworkId){
      setIsDisabled(true);
    }
    else{
      setIsDisabled(false);
    }
  }, [chain]);
  

  const { data: _withdrawableFunds } = useContractRead({
    address: ETCeriaMP1pt2_address,
    abi: ETCeriaMarketplace_ABI,
    functionName: 'pendingWithdrawalOf',
    args: [address],
    watch: true,
  });

  useEffect(() => {

    if (_withdrawableFunds >= 0) {
      const formattedFunds = ethers.formatEther(_withdrawableFunds);
      if (formattedFunds == "0.0") {
        setWithdrawableFunds(0);
      }
      else {
        setWithdrawableFunds(parseFloat(formattedFunds).toFixed(1));
      }
    }
  }, [_withdrawableFunds, address]);


  const { config: _withdraw } = usePrepareContractWrite({
    address: ETCeriaMP1pt2_address,
    abi: ETCeriaMarketplace_ABI,
    functionName: 'withdraw',
    enabled: withdrawableFunds > 0 && withdrawableFunds != undefined,
  })

  const { write: _withdrawFunds } = useContractWrite(_withdraw)

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

      <Head>
        <meta content="made by tschoerv.eth" name="description" />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <div>
        <div className='marktplaceTitle'>
          <h1 className='text-center text-2xl'>Marketplace v1.2</h1>
          <h2 className='text-center'>0% fee</h2></div>


        {/* Main flex container for two columns */}
        <div style={{ display: 'flex', flexDirection: flexDirection, justifyContent: 'center', alignItems: 'center' }}>

          {/* Left column: Centered stack and SetAsk */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 20px' }}>
            {/* Centered stack */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }} className="componentBackground1 m-4 p-6 text-left text-inherit no-underline border border-black rounded-lg max-w-xs">
            {isClientSide && (
          <>
            {chain?.id !== desiredNetworkId && (
              <Button variant="solid" color="danger" onClick={handleSwitchNetwork}>Switch to Ethereum Classic</Button>
            )}
            <ConnectButton chainStatus="none" showBalance={false} />
          </>
        )}
              {withdrawableFunds > 0 && isConnected ?
                <Button variant="faded" onClick={() => _withdrawFunds?.()} className='mt-3'>Withdraw {withdrawableFunds} ETC</Button> :
                <Button variant="faded" isDisabled={true} className='mt-3'>Withdraw</Button>
              }
            </div>
            {/* SetAsk component */}
            <div style={{ marginTop: '20px' }} className="componentBackground2 m-4 text-left text-inherit no-underline border border-black rounded-lg max-w-xs">
              <SetAsk ownerList={ownerList} setOwnerList={setOwnerList} refreshAsksList={refreshAsksList} setRefreshAsksList={setRefreshAsksList} refreshBidsList={refreshBidsList} setRefreshBidsList={setRefreshBidsList} bidTableList={bidTableList} marketplaceContract={ETCeriaMP1pt2_address} isDisabled={isDisabled} />
            </div>
          </div>

          {/* Right column: Bidding */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} className="componentBackground3 m-4 text-left text-inherit no-underline border border-black rounded-lg max-w-xs">
            <Bidding marketplaceContract={ETCeriaMP1pt2_address} isDisabled={isDisabled} />
          </div>
        </div>

        {/* Centered Asks component */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
          <Asks ownerList={ownerList} refreshAsksList={refreshAsksList} marketplaceContract={ETCeriaMP1pt2_address} />
        </div>

        {/* Centered Bids component */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '20px' }}>
          <Bids refreshBidsList={refreshBidsList} tableList={bidTableList} setTableList={setBidTableList} marketplaceContract={ETCeriaMP1pt2_address} />
        </div>
      </div>
      <footer className={"footer"}>
        <div><Link isExternal color="secondary" href={`https://etc.blockscout.com/address/${ETCeriaMP1pt2_address}`}>
          ETCeria v1.2 Marketplace Contract</Link></div>
        <div><p>
          Made for you with ❤️ by tschoerv.eth - donations welcome
        </p></div>
      </footer>
    </div>


  )

}
