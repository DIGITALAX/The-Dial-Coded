import { useState } from "react";
import { UseParametersResult } from "../types/parameters.types";

const useParameters = (): UseParametersResult => {
  const [orderDrop, setOrderDrop] = useState<boolean>(false);
  const [orderType, setTypeDrop] = useState<boolean>(false);
  const [orderPriority, setPriorityDrop] = useState<boolean>(false);
  const [userTypeOpen, setUserTypeOpen] = useState<boolean>(false);
  const feedOrder: string[] = ["chrono", "algo"];
  const feedType: string[] = ["saves", "reflex", "drafts", "canvas"];
  const feedPriority: string[] = ["interests", "reactions"];
  const userList: string[] = [
    "emmajane",
    "0x454c",
    "digitalax",
    "0x84ec",
    "f3manifesto",
    "0x016305",
    "alice",
    "0x454c",
  ];

  return {
    feedOrder,
    feedType,
    feedPriority,
    orderDrop,
    setOrderDrop,
    orderType,
    setTypeDrop,
    orderPriority,
    setPriorityDrop,
    setUserTypeOpen,
    userTypeOpen,
    userList,
  };
};

export default useParameters;
