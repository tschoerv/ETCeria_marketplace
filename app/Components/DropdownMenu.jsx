'use client'
import React, { useState, useEffect} from "react";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@nextui-org/react";

const App = ({ onPresetChange, isDisabled, isCustom }) => {
  const [selectedKeys, setSelectedKeys] = useState(new Set(["global"]));

  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
    [selectedKeys]
  );

  useEffect(() => {
    if (onPresetChange) {
      onPresetChange(selectedKeys);
    }
  }, [selectedKeys]);

  useEffect(() => {
    if(isCustom){
      setSelectedKeys(new Set(["custom"]));
    }
  }, [isCustom]);

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button 
          variant="bordered" 
          className="capitalize bg-slate-100"
          isDisabled={isDisabled}
          color="secondary"
        >
          {selectedValue}
        </Button>
      </DropdownTrigger>
      <DropdownMenu 
        aria-label="Static Actions"
        variant="flat"
        disallowEmptySelection
        selectionMode="single"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      >
        <DropdownItem key="global">Global</DropdownItem>
        <DropdownItem key="grassland">Grassland</DropdownItem>
        <DropdownItem key="hill">Hill</DropdownItem>
        <DropdownItem key="mountain">Mountain</DropdownItem>
        <DropdownItem key="sand">Sand</DropdownItem>
        <DropdownItem key="northern_tundra">Northern Tundra</DropdownItem>
        <DropdownItem key="southern_tundra">Southern Tundra</DropdownItem>
        <DropdownItem key="northern_ice">Northern Ice</DropdownItem>
        <DropdownItem key="southern_ice">Southern Ice</DropdownItem>
        <DropdownItem key="island">Island</DropdownItem>
        <DropdownItem key="water_adjacent">Water Adjacent</DropdownItem>
        <DropdownItem key="landlocked">Landlocked</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
export default App;
