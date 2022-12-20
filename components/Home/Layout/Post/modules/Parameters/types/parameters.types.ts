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
  setUserTypeOpen: (e: boolean) => void;
  userTypeOpen: boolean;
  userList: string[];
  userSelectFeed: any[];
  getMoreUserSelectFeed: () => Promise<void>;
};

export type OptionsProps = {
  feedOrder: string[];
  feedType: string[];
  feedPriority: string[];
  orderPriority: boolean;
  setPriorityDrop: (e: boolean) => void;
  orderType: boolean;
  setTypeDrop: (e: boolean) => void;
  orderDrop: boolean;
  setOrderDrop: (e: boolean) => void;
  setSortCriteria: (e: string) => void;
};

export type ViewerProps = {
  setUserTypeOpen: (e: boolean) => void;
  userTypeOpen: boolean;
  userList: string[];
};
