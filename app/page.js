'use client'
import Head from 'next/head';
import Link from 'next/link';
import React, { useState, useEffect } from 'react'

export default function Home() {
const [flexDirection, setFlexDirection] = useState('row'); // default to row

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
    <div>
      <Head>
        <title>ETCeria Home</title>
        <meta
          content="made by tschoerv.eth"
          name="description"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', justifyContent: 'space-between' }}>
        <div className='main'>
          <h1 className='text-lg ml-1 mr-1'>
            First unique set of digital collectibles on Ethereum Classic
          </h1>

          <div style={{ display: 'flex', flexDirection: flexDirection, alignItems: 'center', margin: '0 20px' }}>
            <Link className="card" href="/marketplace1pt1">
              <h2>Marketplace v1.1 &rarr;</h2>
              <p>&nbsp;buy and sell ETCeria tiles</p>
            </Link>

            <Link className="card" href="/marketplace1pt2">
              <h2>Marketplace v1.2 &rarr;</h2>
              <p>&nbsp;buy and sell ETCeria tiles</p>
            </Link>
          </div>

          <div className="faq">
            <h1 style={{ textAlign: 'center' }} className='text-xl font-bold'>FAQ</h1>
            <h2 className='faqMarginAdjust'>What is ETCeria?</h2>
            <p>ETCeria is the first unique set of digital collectables on Ethereum Classic, notable for its launch before the DAO hack and subsequent Ethereum fork in 2016. Initially underrecognized, the project gained traction when its contract was rediscovered and fully minted out on August 23, 2021.</p>
            <h2>What are ETCeria tiles?</h2>
            <p>ETCeria tiles are part of a digital landscape, comprising a 32x32 grid of hexagon-shaped tiles with varied elevation levels. 457 of these tiles are designated as ownable land. The elevation attribute of each tile on the map determines whether it is a water or land tile. All land tiles are freely tradable on the marketplace, offering a unique opportunity for collectors and enthusiasts.</p>
            <h2>Why are there two versions (v1.1 & v1.2)?</h2>
            <p>In 2015, due to the low cost of ETH and gas, it was common to test contracts directly on the mainnet. This practice led to the creation of several versions of ETCeria on Ethereum Classic, but most of which had significant flaws and cannot be used safely. There are two additional functional versions of ETCeria, namely v0.9 and v1.0. Unfortunately, all tiles from these earlier versions are currently owned by a handful wallets.</p>
            <h2>Why is there no map explorer?</h2>
            <p>Currently, there is no dedicated map explorer for ETCeria, primarily due to the lack of community effort in building one. However, we now have a decentralized marketplace that enables trustless trading of these digital artifacts as a first step. I&apos;m hopeful that as our community grows, we&apos;ll eventually add features like a map explorer and building on tiles.</p>
            <h2>Why is there no wrapper?</h2>
            <p>There is a significant design flaw in the setOwner() function of ETCeria, preventing tiles from being owned by a smart contract. If ETCeria tiles are sent to a smart contract address, they are effectively lost and irretrievable. Hence ETCeria tiles can only be transferred and traded in their native form.</p>
            <h2>How can I contribute?</h2>
            <p>If you&apos;re interested in contributing to the ETCeria project, please reach out to me via Twitter or Discord (@tschoerv). Additionally, please consider donating a portion of your profits from using the marketplace. Together, we can explore and build upon the exciting possibilities of ETCeria!</p>
          </div>

        </div>

        <footer className="footerHome">
          <div><p>
            Made for you with ❤️ by tschoerv.eth - donations welcome
          </p></div>
        </footer>
      </div>
    </div>
  )
}
