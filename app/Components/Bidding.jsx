'use client'
import React, { useRef, useState, useEffect } from 'react'
import { Button, Input } from "@nextui-org/react";
import DropdownMenu from "../Components/DropdownMenu";
import RangeSlider from "../Components/RangeSlider";
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction, useContractRead, useAccount } from "wagmi";
import ETCeriaMarketplace_ABI from "../abi/ETCeria_marketplace_ABI.json";
import { ethers } from 'ethers';


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
  if (a.length !== b.length) {
    return false;
  }

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }

  return true;
}

export default function Bidding({ marketplaceContract, isDisabled }) {
  const column = useRef(null);
  const row = useRef(null);
  const elevation = useRef(null);
  const water = useRef(null);
  const bidInput = useRef(null);

  const [activeBid, setActiveBid] = useState(0);
  const [presetColumnMin, setPresetColumnMin] = useState(0);
  const [presetColumnMax, setPresetColumnMax] = useState(32)
  const [presetRowMin, setPresetRowMin] = useState(0);
  const [presetRowMax, setPresetRowMax] = useState(32);
  const [presetElevationMin, setPresetElevationMin] = useState(125);
  const [presetElevationMax, setPresetElevationMax] = useState(216);
  const [presetWaterMin, setPresetWaterMin] = useState(0);
  const [presetWaterMax, setPresetWaterMax] = useState(6);
  const [bidOf, setBidOf] = useState([]);

  const [bid, setBid] = useState(0);
  const [bidPreset, setBidPreset] = useState("Global")

  const [hasActiveBid, setHasActiveBid] = useState(null);
  const [isCustomSelection, setIsCustomSelection] = useState(false);
  const [renderSliderTrigger, setRenderSliderTrigger] = useState(0);


  const { address, isConnected } = useAccount();

  const { data: _bidOf } = useContractRead({
    address: marketplaceContract,
    abi: ETCeriaMarketplace_ABI,
    functionName: 'bidOf',
    args: [address],
    watch: true,
    onSuccess(_bidOf) {
      setBidOf(_bidOf)
    },
  });

  useEffect(() => {
    if (bidOf && bidOf[0] == 0) {
      setHasActiveBid(false);
    } else if (bidOf && bidOf[0] > 0) {

      const presetInfo = bidOf.slice(1, 9);
      if (arraysEqual(presetInfo, presetValues.global)) {
        setBidPreset("Global")
      }
      else if (arraysEqual(presetInfo, presetValues.grassland)) {
        setBidPreset("Grassland")
      }
      else if (arraysEqual(presetInfo, presetValues.hill)) {
        setBidPreset("Hill")
      }
      else if (arraysEqual(presetInfo, presetValues.mountain)) {
        setBidPreset("Mountain")
      }
      else if (arraysEqual(presetInfo, presetValues.sand)) {
        setBidPreset("Sand")
      }
      else if (arraysEqual(presetInfo, presetValues.northern_tundra)) {
        setBidPreset("Northern Tundra")
      }
      else if (arraysEqual(presetInfo, presetValues.southern_tundra)) {
        setBidPreset("Southern Tundra")
      }
      else if (arraysEqual(presetInfo, presetValues.northern_ice)) {
        setBidPreset("Northern Ice")
      }
      else if (arraysEqual(presetInfo, presetValues.southern_ice)) {
        setBidPreset("Southern Ice")
      }
      else if (arraysEqual(presetInfo, presetValues.island)) {
        setBidPreset("Island")
      }
      else if (arraysEqual(presetInfo, presetValues.water_adjacent)) {
        setBidPreset("Water Adjacent")
      }
      else if (arraysEqual(presetInfo, presetValues.landlocked)) {
        setBidPreset("Landlocked")
      }
      else {
        setBidPreset("Custom")
      }
      setHasActiveBid(true);
      setActiveBid(ethers.formatEther(bidOf[0]));
      setPresetColumnMin(bidOf[1]);
      setPresetColumnMax(bidOf[2]);
      setPresetRowMin(bidOf[3]);
      setPresetRowMax(bidOf[4]);
      setPresetElevationMin(bidOf[5]);
      setPresetElevationMax(bidOf[6]);
      setPresetWaterMin(bidOf[7]);
      setPresetWaterMax(bidOf[8]);
    }

  }, [bidOf, address]);

  const handlePresetChange = (newPreset) => {
    if (isCustomSelection) {
      setIsCustomSelection(false);
    }

    if (newPreset.currentKey === "global") {
      setPresetColumnMin(0);
      setPresetColumnMax(32);
      setPresetRowMin(0);
      setPresetRowMax(32);
      setPresetElevationMin(125);
      setPresetElevationMax(216);
      setPresetWaterMin(0);
      setPresetWaterMax(6);
    }
    if (newPreset.currentKey === "grassland") {
      setPresetColumnMin(0);
      setPresetColumnMax(32);
      setPresetRowMin(3);
      setPresetRowMax(29);
      setPresetElevationMin(135);
      setPresetElevationMax(169);
      setPresetWaterMin(0);
      setPresetWaterMax(6);
    }
    if (newPreset.currentKey === "hill") {
      setPresetColumnMin(0);
      setPresetColumnMax(32);
      setPresetRowMin(0);
      setPresetRowMax(32);
      setPresetElevationMin(170);
      setPresetElevationMax(199);
      setPresetWaterMin(0);
      setPresetWaterMax(6);
    }
    if (newPreset.currentKey === "mountain") {
      setPresetColumnMin(0);
      setPresetColumnMax(32);
      setPresetRowMin(0);
      setPresetRowMax(32);
      setPresetElevationMin(200);
      setPresetElevationMax(216);
      setPresetWaterMin(0);
      setPresetWaterMax(6);
    }
    if (newPreset.currentKey === "sand") {
      setPresetColumnMin(0);
      setPresetColumnMax(32);
      setPresetRowMin(3);
      setPresetRowMax(29);
      setPresetElevationMin(125);
      setPresetElevationMax(134);
      setPresetWaterMin(0);
      setPresetWaterMax(6);
    }
    if (newPreset.currentKey === "northern_tundra") {
      setPresetColumnMin(0);
      setPresetColumnMax(32);
      setPresetRowMin(30);
      setPresetRowMax(30);
      setPresetElevationMin(125);
      setPresetElevationMax(216);
      setPresetWaterMin(0);
      setPresetWaterMax(6);
    }
    if (newPreset.currentKey === "southern_tundra") {
      setPresetColumnMin(0);
      setPresetColumnMax(32);
      setPresetRowMin(2);
      setPresetRowMax(2);
      setPresetElevationMin(125);
      setPresetElevationMax(216);
      setPresetWaterMin(0);
      setPresetWaterMax(6);
    }
    if (newPreset.currentKey === "northern_ice") {
      setPresetColumnMin(0);
      setPresetColumnMax(32);
      setPresetRowMin(31);
      setPresetRowMax(31);
      setPresetElevationMin(125);
      setPresetElevationMax(216);
      setPresetWaterMin(0);
      setPresetWaterMax(6);
    }
    if (newPreset.currentKey === "southern_ice") {
      setPresetColumnMin(0);
      setPresetColumnMax(32);
      setPresetRowMin(1);
      setPresetRowMax(1);
      setPresetElevationMin(125);
      setPresetElevationMax(216);
      setPresetWaterMin(0);
      setPresetWaterMax(6);
    }
    if (newPreset.currentKey === "island") {
      setPresetColumnMin(0);
      setPresetColumnMax(32);
      setPresetRowMin(0);
      setPresetRowMax(32);
      setPresetElevationMin(125);
      setPresetElevationMax(216);
      setPresetWaterMin(6);
      setPresetWaterMax(6);
    }
    if (newPreset.currentKey === "water_adjacent") {
      setPresetColumnMin(0);
      setPresetColumnMax(32);
      setPresetRowMin(0);
      setPresetRowMax(32);
      setPresetElevationMin(125);
      setPresetElevationMax(216);
      setPresetWaterMin(1);
      setPresetWaterMax(6);
    }
    if (newPreset.currentKey === "landlocked") {
      setPresetColumnMin(0);
      setPresetColumnMax(32);
      setPresetRowMin(0);
      setPresetRowMax(32);
      setPresetElevationMin(125);
      setPresetElevationMax(216);
      setPresetWaterMin(0);
      setPresetWaterMax(0);
    }
    if (newPreset.currentKey != null) {
      setRenderSliderTrigger(renderSliderTrigger + 1);
    }
  };

  const handleSliderChange = () => {
    setIsCustomSelection(true);
  };

  const { config: bidConfig } = usePrepareContractWrite({
    address: marketplaceContract,
    abi: ETCeriaMarketplace_ABI,
    functionName: 'makeBid',
    value: ethers.parseEther(bid.toString()).toString(),
    args: [column.current?.getMin(), column.current?.getMax(), row.current?.getMin(), row.current?.getMax(), elevation.current?.getMin(), elevation.current?.getMax(), water.current?.getMin(), water.current?.getMax()],
    enabled: (!hasActiveBid),
  })

  const { write: _makeBid } = useContractWrite(bidConfig)

  const { config: cancelBidConfig } = usePrepareContractWrite({
    address: marketplaceContract,
    abi: ETCeriaMarketplace_ABI,
    functionName: 'cancelBid',
    enabled: hasActiveBid
  })

  const { write: _cancelBid, data: cancelBidData } = useContractWrite(cancelBidConfig)

  const { data: waitForCancelConfirmation } = useWaitForTransaction({
    hash: cancelBidData?.hash,
  })

  useEffect(() => {
    if (waitForCancelConfirmation != null) {
      setPresetColumnMin(0);
      setPresetColumnMax(32);
      setPresetRowMin(0);
      setPresetRowMax(32);
      setPresetElevationMin(125);
      setPresetElevationMax(216);
      setPresetWaterMin(0);
      setPresetWaterMax(6);
      setRenderSliderTrigger(renderSliderTrigger + 1);
    }


  }, [waitForCancelConfirmation])

  return (
    <div className='flex flex-col items-center bg-inherit p-6 rounded-lg'>
      <div>
        <div>
          <span className="text-sm">Column</span>
          <RangeSlider
            ref={column}
            initialMin={presetColumnMin}
            initialMax={presetColumnMax}
            min={0}
            max={32}
            step={1}
            priceCap={0}
            isDisabled={hasActiveBid || isDisabled}
            onSliderChange={handleSliderChange}
            renderSliderTrigger={renderSliderTrigger}
          />
        </div>
        <div>
          <span className="text-sm">Row</span>
          <RangeSlider
            ref={row}
            initialMin={presetRowMin}
            initialMax={presetRowMax}
            min={0}
            max={32}
            step={1}
            priceCap={0}
            isDisabled={hasActiveBid || isDisabled}
            onSliderChange={handleSliderChange}
            renderSliderTrigger={renderSliderTrigger}
          />
        </div>
        <div>
          <span className="text-sm">Elevation</span>
          <RangeSlider
            ref={elevation}
            initialMin={presetElevationMin}
            initialMax={presetElevationMax}
            min={125}
            max={216}
            step={1}
            priceCap={0}
            isDisabled={hasActiveBid || isDisabled}
            onSliderChange={handleSliderChange}
            renderSliderTrigger={renderSliderTrigger}
          />
        </div>
        <div>
          <span className="text-sm">Adjacent Water</span>
          <RangeSlider
            ref={water}
            initialMin={presetWaterMin}
            initialMax={presetWaterMax}
            min={0}
            max={6}
            step={1}
            priceCap={0}
            isDisabled={hasActiveBid || isDisabled}
            onSliderChange={handleSliderChange}
            renderSliderTrigger={renderSliderTrigger}
          />
        </div></div>
      {hasActiveBid || isDisabled ? <Button className='mb-2 bg-slate-100' variant="bordered" isDisabled={true}>{bidPreset}</Button> : <div className='mb-2'>
        <DropdownMenu onPresetChange={handlePresetChange} isDisabled={hasActiveBid} isCustom={isCustomSelection} />
      </div>}
      <div className="w-32 mb-2">
        {hasActiveBid || isDisabled ? <Input
          placeholder={isDisabled ? "0" : activeBid}
          label="Bid"
          labelPlacement="inside"
          size="lg"
          variant="faded"
          endContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 ">ETC</span>
            </div>
          }
          type="number"
          isDisabled={true}
        /> :
          <Input
            ref={bidInput}
            placeholder="0"
            label="Bid"
            labelPlacement="inside"
            size="lg"
            variant="faded"
            endContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-default-400 ">ETC</span>
              </div>
            }
            onValueChange={(newBid) => {
              if (newBid !== "") {
                setBid(newBid);
              }
              else if (newBid == "") {
                setBid(0);
              }
            }}
            type="number"
            isDisabled={hasActiveBid || hasActiveBid == null}
          />}
      </div>
      <div className='flex flex-col items-center'>
        {hasActiveBid ? <Button variant="faded" color="danger" onClick={() => _cancelBid?.()}>Cancel Bid</Button> : <Button variant="faded" onClick={() => _makeBid?.()} isDisabled={!(bid > 0 && isConnected) || hasActiveBid == null}>Make Bid</Button>}

      </div>
    </div>
  )
}
