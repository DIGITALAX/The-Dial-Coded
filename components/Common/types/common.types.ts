import { Dispatch, AnyAction } from "redux";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { BadgeInfo } from "../../Home/Badges/types/badges.types";
import { Erc20 } from "./lens.types";

export type ReactionProps = {
  textColor: string;
  commentColor: string;
  mirrorColor: string;
  collectColor: string;
  heartColor: string;
};

export type InterfaceProps = {
  title: string;
  tapeTitles: string[];
  handleTapeSet: (title: string) => void;
  images?: string[];
  message?: Message;
  backgroundImages?: string[];
  sideImage?: string;
  mixtape?: boolean;
};

export type BoxProps = {
  image: string;
  row: string;
  col: string;
  self: string;
  justify: string;
  contain?: boolean;
  bgColor?: boolean;
  rounded?: boolean;
  border?: boolean;
};

export type BadgeProps = {
  index: number;
  badgeInfo: BadgeInfo;
};

export type RewindProps = {
  row: string;
  scale?: string;
  limitValue?: number;
  currentValue?: number;
  handleValueChange?: (e: number) => void;
};

export type TopicProps = {
  index: number;
  dispatch: Dispatch<AnyAction>;
  setTopic: ActionCreatorWithPayload<string, "topic/setTopic">;
  topic: string;
  selectedTopic: string;
};

export type TopicValuesProps = {
  index: number;
  value: string;
};

export type PanelOptionProps = {
  index: number;
  dispatch: Dispatch<AnyAction>;
  layoutType: string[];
  setLayout: ActionCreatorWithPayload<string, "layout/setLayout">;
  uri: string;
};

export type ArrowProps = {
  handleValue?: (e: boolean) => void;
  value?: boolean;
  up: string;
  middle: string;
  down: string;
  vertical?: boolean;
};

export type PresetProps = {
  index: number;
  format: string;
};

export type FeedPublicationProps = {
  images: string[];
  row: string;
};

export type OptionMenuProps = {
  col?: string;
  image: string;
  handleOpenDropdown: (e: boolean) => void;
  openDropdown: boolean;
  bgColor: string;
  values: string[];
  dispatch: Dispatch<AnyAction>;
  dispatchFunction: any;
  selectorValue: string | undefined;
  imageWidth: number;
  imageHeight: number;
};

export type LineProps = {
  col: string;
  width: string;
};

export type PanelProps = {
  col: string;
};

export type TapeProps = {
  bgColor: string;
  backgroundImages?: string[];
  sideImage?: string;
  title?: string;
  locked?: boolean;
  mixtape?: boolean;
  index: number;
  handleTapeSet?: (title: string) => void;
};

export type MainDisplayProps = {
  row: string;
  title: string;
  mixtape?: boolean;
  tapeTitles: string[];
  handleTapeSet: (title: string) => void;
  images?: string[];
  message?: Message;
  backgroundImages?: string[];
  sideImage?: string;
};

export type ButtonIconProps = {
  width: string;
  height: string;
  image?: string;
  col: string;
  justify: string;
  self: string;
};

export type NotificationSliderProps = {
  images?: string[];
};

export type NotificationBarProps = {
  images?: string[];
  message?: Message;
};

export interface Message {
  title: string;
  paragraph: string;
}

export type NotificationMessageProps = {
  message?: Message;
};

export type MixSaveProps = {
  col: string;
};

export type MixButtonProps = {
  col: string;
  bgColor: string;
  text: string;
  textSize: string;
  width: string;
  border?: boolean;
};

export type MixInputProps = {
  row: string;
  name: string;
  title: string;
};

export type MixCheckProps = {
  value: string;
  handleClicked: (valueClicked: boolean, value: string) => void;
  valueClicked: boolean;
};

export type UseCreateMixtapeResults = {
  checkValues: string[];
  handleClicked: (valueClicked: boolean, value: string) => void;
  valueClicked: boolean;
};

export type CreateMixtapeProps = {
  checkValues: string[];
  handleClicked: (valueClicked: boolean, value: string) => void;
  valueClicked: boolean;
  dispatch: Dispatch<AnyAction>;
  setAddTrack: ActionCreatorWithPayload<number, "add track/setAddTrack">;
  setEditTrack: ActionCreatorWithPayload<string, "edit track/setEditTrack">;
  setDeleteTrack: ActionCreatorWithPayload<
    string,
    "delete track/setDeleteTrack"
  >;
  setAddMixtape: ActionCreatorWithPayload<string, "add mixtape/setAddMixtape">;
  trackNumber: number | undefined;
};

export type TrackInputProps = {
  index: number;
};

export type RecordProps = {
  index: number;
  recordImage: string;
};

export type useLensSignInResults = {
  handleLensLogin: () => Promise<void>;
  profileState: string;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
};

export type LensSignInProps = {
  handleAction?: () => any;
  isLoading?: boolean;
};

export type AuthSwitchProps = {
  isConnected: boolean;
  profileState: string;
  dispatch: Dispatch<AnyAction>;
};

export type ProfileProps = {
  dispatch: Dispatch<AnyAction>;
};

export type PostOptionsProps = {
  dispatch: Dispatch<AnyAction>;
  imagePicker: string | undefined;
};

export type ImagePickerProps = {
  imagePicker: string;
};

export type CollectButtonProps = {
  values?: string[] | Erc20[];
  col: string;
  row: string;
  openDropdown: boolean;
  handleOpenDropdown: (e: boolean) => void;
  selectValue: string | undefined;
  selectFunction: (e: string) => void;
  label: string;
};

export type UseCollectionModalResults = {
  enabledCurrencies: Erc20[];
  collectTypes: string[];
  audienceTypes: string[];
  setCollectType: (e: string) => void;
  collectType: string;
  setAudienceType: (e: string) => void;
  audienceType: string;
  setEnabledCurrency: (e: string) => void;
  enabledCurrency: string | undefined;
  setChargeCollectDropDown: (e: boolean) => void;
  setAudienceDropDown: (e: boolean) => void;
  setCurrencyDropDown: (e: boolean) => void;
  chargeCollectDropDown: boolean;
  audienceDropDown: boolean;
  currencyDropDown: boolean;
  referral: number;
  setReferral: (e: number) => void;
  limit: number;
  setLimit: (e: number) => void;
  value: number;
  setValue: (e: number) => void;
  collectibleDropDown: boolean;
  setCollectibleDropDown: (e: boolean) => void;
  collectible: string;
  setCollectible: (e: string) => void;
  chargeCollect: string;
  setChargeCollect: (e: string) => void;
  limitedDropDown: boolean;
  setLimitedDropDown: (e: boolean) => void;
  limitedEdition: string;
  setLimitedEdition: (e: string) => void;
  setTimeLimit: (e: string) => void;
  timeLimit: string;
  timeLimitDropDown: boolean;
  setTimeLimitDropDown: (e: boolean) => void;
};

export type CollectOptionsModalProps = {
  enabledCurrencies: Erc20[];
  collectTypes: string[];
  dispatch: Dispatch<AnyAction>;
  audienceTypes: string[];
  setCollectType: (e: string) => void;
  collectType: string;
  setAudienceType: (e: string) => void;
  audienceType: string;
  setEnabledCurrency: (e: string) => void;
  enabledCurrency: string | undefined;
  setChargeCollectDropDown: (e: boolean) => void;
  setAudienceDropDown: (e: boolean) => void;
  setCurrencyDropDown: (e: boolean) => void;
  chargeCollectDropDown: boolean;
  audienceDropDown: boolean;
  currencyDropDown: boolean;
  referral: number;
  setReferral: (e: number) => void;
  limit: number;
  setLimit: (e: number) => void;
  value: number;
  setValue: (e: number) => void;
  collectibleDropDown: boolean;
  setCollectibleDropDown: (e: boolean) => void;
  collectible: string;
  setCollectible: (e: string) => void;
  chargeCollect: string;
  setChargeCollect: (e: string) => void;
  limitedDropDown: boolean;
  setLimitedDropDown: (e: boolean) => void;
  limitedEdition: string;
  setLimitedEdition: (e: string) => void;
  setTimeLimit: (e: string) => void;
  timeLimit: string;
  timeLimitDropDown: boolean;
  setTimeLimitDropDown: (e: boolean) => void;
};

export type CollectInputProps = {
  id: string;
  name: string;
  step?: string;
  min?: string;
  max?: string;
  placeholder?: string;
  defaultValue?: string;
  col?: string;
  row?: string;
  label?: string;
  valueChange: number;
  handleValueChange: (e: number) => void;
};
