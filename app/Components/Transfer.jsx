'use client'
import React, { useState, useEffect } from 'react'
import { Button, Input } from "@nextui-org/react";
import { useWriteContract, useWaitForTransactionReceipt, useSimulateContract, useAccount, useReadContract } from "wagmi";
import ETCeria_ABI from "../ABI/ETCeria_ABI.json";
import ETCeriaMarketplace_ABI from "../ABI/ETCeria_marketplace_ABI.json";
import allTileCoordinatesWithIndices from "../ABI/allTileCoordinatesWithIndices.json";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { useQueryClient } from '@tanstack/react-query'

const allTileCoordinates = [[1, 6], [1, 13], [1, 14], [1, 15], [1, 25], [1, 26], [1, 27], [2, 5], [2, 6], [2, 7], [2, 13], [2, 14], [2, 15], [2, 16], [2, 20], [2, 25], [2, 26], [2, 27], [3, 4], [3, 6], [3, 13], [3, 14], [3, 15], [3, 16], [3, 17], [3, 19], [3, 20], [3, 26], [3, 27], [3, 28], [4, 3], [4, 4], [4, 5], [4, 14], [4, 15], [4, 16], [4, 17], [4, 18], [4, 19], [4, 20], [4, 21], [4, 27], [4, 28], [4, 29], [5, 3], [5, 4], [5, 9], [5, 14], [5, 15], [5, 16], [5, 18], [5, 19], [5, 20], [5, 25], [5, 26], [5, 27], [5, 28], [5, 29], [6, 13], [6, 14], [6, 15], [6, 16], [6, 17], [6, 19], [6, 20], [6, 26], [6, 27], [7, 11], [7, 12], [7, 13], [7, 14], [7, 15], [7, 16], [7, 18], [7, 19], [7, 20], [7, 27], [8, 11], [8, 12], [8, 13], [8, 14], [8, 15], [8, 16], [8, 17], [8, 18], [8, 19], [8, 20], [8, 21], [9, 9], [9, 10], [9, 12], [9, 13], [9, 14], [9, 15], [9, 16], [9, 17], [9, 18], [9, 19], [9, 20], [9, 22], [9, 23], [9, 25], [10, 9], [10, 10], [10, 11], [10, 12], [10, 13], [10, 14], [10, 15], [10, 16], [10, 17], [10, 18], [10, 19], [10, 20], [10, 21], [10, 22], [10, 23], [10, 26], [10, 27], [10, 28], [11, 8], [11, 9], [11, 10], [11, 13], [11, 14], [11, 15], [11, 16], [11, 17], [11, 18], [11, 19], [11, 20], [11, 22], [11, 24], [11, 26], [11, 27], [11, 28], [11, 29], [11, 31], [12, 7], [12, 8], [12, 9], [12, 10], [12, 13], [12, 14], [12, 15], [12, 16], [12, 17], [12, 18], [12, 19], [12, 20], [12, 21], [12, 22], [12, 23], [12, 24], [12, 25], [12, 26], [12, 27], [12, 28], [12, 29], [12, 30], [13, 2], [13, 3], [13, 5], [13, 6], [13, 8], [13, 9], [13, 10], [13, 11], [13, 12], [13, 14], [13, 15], [13, 16], [13, 17], [13, 18], [13, 19], [13, 20], [13, 21], [13, 22], [13, 23], [13, 24], [13, 26], [13, 28], [13, 30], [13, 31], [14, 1], [14, 2], [14, 3], [14, 5], [14, 6], [14, 7], [14, 8], [14, 9], [14, 10], [14, 11], [14, 12], [14, 13], [14, 15], [14, 16], [14, 17], [14, 18], [14, 19], [14, 20], [14, 21], [14, 23], [14, 24], [14, 25], [14, 26], [14, 27], [14, 28], [14, 29], [14, 30], [14, 31], [15, 2], [15, 3], [15, 4], [15, 5], [15, 6], [15, 7], [15, 8], [15, 9], [15, 10], [15, 11], [15, 12], [15, 14], [15, 15], [15, 16], [15, 17], [15, 18], [15, 19], [15, 20], [15, 21], [15, 22], [15, 23], [15, 24], [15, 25], [15, 26], [15, 28], [15, 29], [15, 30], [16, 2], [16, 3], [16, 4], [16, 5], [16, 6], [16, 7], [16, 8], [16, 9], [16, 10], [16, 11], [16, 12], [16, 13], [16, 14], [16, 15], [16, 16], [16, 17], [16, 18], [16, 19], [16, 20], [16, 21], [16, 22], [16, 23], [16, 24], [16, 25], [16, 26], [16, 27], [16, 28], [16, 29], [16, 30], [17, 3], [17, 6], [17, 7], [17, 8], [17, 9], [17, 10], [17, 11], [17, 12], [17, 13], [17, 14], [17, 15], [17, 16], [17, 17], [17, 18], [17, 19], [17, 20], [17, 21], [17, 22], [17, 23], [17, 24], [17, 25], [17, 26], [17, 27], [18, 7], [18, 8], [18, 9], [18, 10], [18, 11], [18, 12], [18, 13], [18, 14], [18, 15], [18, 16], [18, 17], [18, 18], [18, 19], [18, 20], [18, 21], [18, 22], [18, 23], [18, 24], [18, 25], [19, 7], [19, 8], [19, 9], [19, 10], [19, 11], [19, 12], [19, 13], [19, 14], [19, 15], [19, 16], [19, 17], [19, 18], [19, 19], [19, 20], [19, 21], [19, 22], [19, 23], [19, 24], [20, 7], [20, 8], [20, 9], [20, 10], [20, 11], [20, 12], [20, 13], [20, 14], [20, 15], [20, 16], [20, 17], [20, 18], [20, 19], [20, 20], [20, 21], [20, 22], [20, 23], [21, 1], [21, 8], [21, 9], [21, 10], [21, 11], [21, 12], [21, 13], [21, 14], [21, 15], [21, 16], [21, 17], [21, 18], [21, 19], [21, 20], [21, 21], [21, 22], [21, 25], [22, 6], [22, 7], [22, 8], [22, 9], [22, 10], [22, 11], [22, 12], [22, 13], [22, 14], [22, 15], [22, 16], [22, 17], [22, 18], [22, 19], [22, 20], [22, 21], [23, 1], [23, 6], [23, 7], [23, 8], [23, 10], [23, 12], [23, 13], [23, 14], [23, 15], [23, 16], [23, 17], [23, 18], [23, 19], [23, 20], [23, 31], [24, 4], [24, 5], [24, 6], [24, 7], [24, 8], [24, 9], [24, 10], [24, 11], [24, 12], [24, 13], [24, 14], [24, 15], [24, 16], [24, 17], [24, 18], [24, 19], [25, 8], [25, 12], [25, 14], [25, 15], [25, 16], [25, 17], [25, 18], [25, 19], [26, 8], [26, 12], [26, 13], [26, 14], [26, 15], [26, 16], [26, 17], [26, 18], [26, 19], [26, 22], [27, 8], [27, 13], [27, 14], [27, 15], [27, 16], [27, 17], [27, 18], [27, 19], [27, 21], [28, 8], [28, 14], [28, 15], [28, 16], [28, 17], [28, 28], [28, 29], [29, 13], [29, 15], [29, 16], [29, 17], [29, 18], [29, 28], [29, 31], [30, 16], [30, 17], [30, 18], [30, 22], [30, 30], [31, 21], [31, 29]];

export default function SetAsk({ marketplaceContract, etceriaContract }) {
  const { address, isConnected } = useAccount();
  const [ownerList, setOwnerList] = useState([]);
  const [ownedTiles, setOwnedTiles] = useState([]);
  const [selectedTile, setSelectedTile] = useState(new Set(["owned Tiles"]));
  const [newOwner, setNewOwner] = useState("");

  const queryClient = useQueryClient();

  const selectedValue = React.useMemo(
    () => Array.from(selectedTile).join(", ").replaceAll("_", " "),
    [selectedTile]
  );

  useEffect(() => {
    if (address) {
      setSelectedTile(new Set(["owned Tiles"]));
    }
  }, [address]);

  const { data: ownerListData, isSuccess: isSuccessOwnerListData, queryKey: ownerListDataQueryKey } = useReadContract({
    address: marketplaceContract,
    abi: ETCeriaMarketplace_ABI,
    functionName: 'getOwners',
    args: [allTileCoordinates],
  });

  useEffect(() => {
    if (isSuccessOwnerListData && isConnected) {
      setOwnerList(ownerListData)
    }
  }, [ownerListData, isSuccessOwnerListData]);

  useEffect(() => {
    setOwnedTiles(ownerList.map((owner, index) => {
      if (owner == address) {
        return { col: allTileCoordinatesWithIndices[index].col, row: allTileCoordinatesWithIndices[index].row, owner: owner?.result };
      }
      return null;
    }).filter(tile => tile !== null));
  }, [ownerList, address]);

  const { data: simulateTransfer } = useSimulateContract({
    address: etceriaContract,
    abi: ETCeria_ABI,
    functionName: 'setOwner',
    args: [selectedValue.split(',')[0], selectedValue.split(',')[1], newOwner]
  });
  const { writeContract: _transfer, data: transferHash } = useWriteContract();

  const { isSuccess: transferConfirmed } =
    useWaitForTransactionReceipt({
      hash: transferHash,
    })

  useEffect(() => {
    queryClient.invalidateQueries({ ownerListDataQueryKey })
  }, [transferConfirmed, address]);


  return (
    <div className='flex flex-col justify-center items-center bg-inherit p-6 rounded-lg'>

      <Dropdown>
        <DropdownTrigger>
          {!(ownedTiles && ownedTiles.length > 0) || (!isConnected) ? <Button
            variant="bordered" className=' bg-slate-100' isDisabled={true} isLoading={ownerList.length == 0 && isConnected}
          >No owned Tiles</Button> : <Button
            variant="bordered" color="secondary" className='bg-slate-100'
          >{selectedValue == "owned Tiles" ? selectedValue : "Tile " + selectedValue}
          </Button>}
        </DropdownTrigger>
        <DropdownMenu aria-label="Dynamic Actions" items={ownedTiles}
          variant="flat"
          disallowEmptySelection
          selectionMode="single"
          selectedKeys={selectedTile}
          onSelectionChange={setSelectedTile}
          className="scrollable-dropdown-menu">
          {(tile) => (
            <DropdownItem
              key={[tile.col, tile.row]}>
              Tile {tile.col},{tile.row}
            </DropdownItem>
          )}
        </DropdownMenu>
      </Dropdown>

      <div className="mb-2 mt-3 justify-center items-center" style={{width: "440px"}}>
        <Input
          placeholder="Enter address"
          label="New Owner"
          labelPlacement="inside"
          size="lg"
          variant="faded"
          onValueChange={(_newOwner) => {
            if (_newOwner !== "") {
              setNewOwner(_newOwner);
            }
            else if (_newOwner == "") {
              setNewOwner("");
            }
          }}
          type="text"
          isDisabled={selectedValue === "owned Tiles" || (!isConnected)}
        /></div>

      <Button variant="faded" color="danger" isDisabled={selectedValue === "owned Tiles" || (!isConnected) || newOwner == ""} onClick={() => _transfer(simulateTransfer?.request)}>Transfer Tile</Button>

    </div>
  )
}