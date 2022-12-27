import { FormEvent } from "react";
import { Profile } from "../../../../../../Common/types/lens.types";

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
  userTypeOpen: boolean;
  profileSearch: any[];
  searchProfiles: (e: FormEvent) => Promise<void>;
  searchLoading: boolean;
  handleChosenProfile: (user: Profile) => void;
  getMoreProfiles: () => Promise<void>;
  chosenProfile: any;
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
};

export type ViewerProps = {
  userTypeOpen: boolean;
  searchProfiles: (e: FormEvent) => Promise<void>;
  profileSearch: any[];
  searchLoading: boolean;
  handleChosenProfile: (user: Profile) => void;
  getMoreProfiles: () => Promise<void>;
  chosenProfile: any;
};
