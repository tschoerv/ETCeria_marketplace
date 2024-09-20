'use client'
import React, { useState, useEffect } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Transfer from "../Components/Transfer";
import { Link, Button } from "@nextui-org/react";
import Image from 'next/image';
import { useSwitchChain, useAccount } from "wagmi";
import { Card, CardBody, Tabs, Tab } from "@nextui-org/react";

export default function Tilemanager() {

    const [isClientSide, setIsClientSide] = useState(false);

    const ETCeriaMP1pt1_address = process.env.NEXT_PUBLIC_ETCERIA_MARKETPLACE_ADDRESS_V1PT1;
    const ETCeriaMP1pt2_address = process.env.NEXT_PUBLIC_ETCERIA_MARKETPLACE_ADDRESS_V1PT2;

    const ETCeria1pt1_address = process.env.NEXT_PUBLIC_ETCERIA_ADDRESS_V1PT1;
    const ETCeria1pt2_address = process.env.NEXT_PUBLIC_ETCERIA_ADDRESS_V1PT2;

    const { isConnected, chain, address } = useAccount();

    const { switchChain } = useSwitchChain();
    const desiredNetworkId = 61; // Chain ID for Ethereum Classic

    useEffect(() => {
        document.title = 'ETCeria Marketplace v1.2';
    }, []);

    useEffect(() => {
        setIsClientSide(true); // Set to true once the component has mounted on the client
    }, []);

    const handleSwitchChain = () => {
        switchChain({ chainId: desiredNetworkId });
    };

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
            <div className='flex flex-col items-center justify-center'>
                <div className='marktplaceTitle'>
                    <h1 className='text-center text-2xl'>Tile Manager</h1>
                </div>

                    {/* Left column: Centered stack and SetAsk */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} className='mt-3'>
                        {/* Centered stack */}
                        {isClientSide && (
                            <>
                                {chain?.id !== desiredNetworkId && isConnected ?
                                    <Button variant="solid" color="danger" onClick={handleSwitchChain}>Switch to Ethereum Classic</Button> :
                                    <ConnectButton chainStatus="none" showBalance={false} />
                                }
                            </>
                        )}
                    </div>

                    <Card className="bg-[#dfc9aa] md:m-3 m-3 mb-64 text-left text-inherit no-underline border border-black rounded-lg w-fit justify-center items-center">
                        <CardBody className="items-center justify-center">
                        <Tabs className="items-center justify-center">
                            <Tab key="1pt1" title="v1.1" ><Transfer marketplaceContract={ETCeriaMP1pt1_address} etceriaContract={ETCeria1pt1_address} /></Tab>
                            <Tab key="1pt2" title="v1.2" ><Transfer marketplaceContract={ETCeriaMP1pt2_address} etceriaContract={ETCeria1pt2_address}/></Tab>
                        </Tabs>
                        </CardBody>
            </Card>
            </div>
            <footer className={"footer"}>
                <div><p>
                    <Link isExternal color="secondary" href={`https://github.com/tschoerv/ETCeria_marketplace`}>Made</Link> by <Link isExternal color="secondary" href={`https://x.com/tschoerv`}>tschoerv.eth</Link> - donations welcome
                </p></div>
            </footer>
        </div>


    )

}
