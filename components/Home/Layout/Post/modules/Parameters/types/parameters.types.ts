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
  setFeedType: (e: string[]) => void;
  setSortCriteria: (e: string) => void;
  fetchMorePublications: () => Promise<void>;
};

export type ViewerProps = {
  setUserTypeOpen: (e: boolean) => void;
  userTypeOpen: boolean;
  userList: string[];
};
