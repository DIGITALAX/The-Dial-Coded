export type UseParametersResult = {
  feedOrder: string[];
  feedType: string[];
  feedPriority: string[];
  orderPriority: boolean;
  setPriorityDrop: (e: boolean) => void;
  orderType: boolean;
  setTypeDrop: (e: boolean) => void;
  orderDrop: boolean;
  setOrderDrop: (e: boolean) => void;
};
