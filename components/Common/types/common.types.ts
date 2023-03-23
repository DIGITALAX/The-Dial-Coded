import { Dispatch, AnyAction } from "redux";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { BadgeInfo } from "../../Layout/Badges/types/badges.types";
import {
  Erc20,
  PaginatedFollowersResult,
  PaginatedFollowingResult,
  Post,
  Profile,
  ProfileQueryRequest,
  PublicationSearchResult,
  ReactionRequest,
  WhoCollectedPublicationRequest,
} from "./lens.types";
import { FormEvent } from "react";

export type ReactionProps = {
  id?: string;
  textColor: string;
  commentColor: string;
  mirrorColor: string;
  collectColor: string;
  heartColor: string;
  mirrorAmount?: string | number;
  collectAmount?: string | number;
  heartAmount?: string | number;
  commentAmount?: string | number;
  mirrorExpand?: ActionCreatorWithPayload<any>;
  heartExpand?: ActionCreatorWithPayload<any>;
  collectExpand?: ActionCreatorWithPayload<any>;
  commentExpand?: ActionCreatorWithPayload<any>;
  dispatch: Dispatch<AnyAction>;
  mirrorValue?: string;
  collectValue?: string;
  commentValue?: string;
  heartValue?: string;
  canCollect?: boolean;
  hasCollected?: boolean;
  hasReacted?: boolean;
  hasMirrored?: boolean;
  hasCommented?: boolean;
  handleHidePost: (id: string, dispatch: Dispatch<AnyAction>) => Promise<void>;
  canDelete: boolean;
  followerOnly: boolean;
  isMixtape: boolean;
  reactionLoaded: boolean;
};

export type InterfaceProps = {
  title?: string;
  tapeTitles?: string[];
  handleTapeSet?: (title: string) => void;
  images?: string[];
  message?: Message;
  backgroundImages?: string[];
  sideImage?: string;
  mixtape?: boolean;
  loader?: boolean;
  more?: () => Promise<void>;
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
  dispatch: Dispatch<AnyAction>;
  searchTarget: string;
  handleOnClick: (
    category: string,
    dispatch: Dispatch<AnyAction>,
    searchTarget: string
  ) => void;
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
  dispatch: Dispatch<AnyAction>;
  searchTarget: string;
  handleOnClick: (
    category: string,
    dispatch: Dispatch<AnyAction>,
    searchTarget: string
  ) => void;
};

export type FeedPublicationProps = {
  publication: PublicationSearchResult;
  dispatch: Dispatch<AnyAction>;
  type?: string;
  hasReacted?: boolean | undefined;
  reactionsFeed?: number;
  hasMirrored?: boolean | undefined;
  hasCommented?: boolean | undefined;
  mixtapeMirror?: boolean;
  handleHidePost: (id: string, dispatch: Dispatch<AnyAction>) => Promise<void>;
  followerOnly: boolean;
  height?: string;
  reactionLoaded: boolean;
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
  loader?: boolean;
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
  loader?: boolean;
  more?: () => Promise<void>;
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
  clickHandle?: () => Promise<void>;
  loader?: boolean;
};

export type MixInputProps = {
  col: string;
  name: string;
  title: string;
  handleChange: (e: FormEvent) => void;
  value: string;
  loader?: boolean;
};

export type MixCheckProps = {
  handleClicked: (valueClicked: boolean, value: string) => void;
  valueClicked: boolean;
  value: string;
  loader?: boolean;
};

export type UseMixtapeImagesResults = {
  uploadImage: (e: FormEvent, index: number) => Promise<void>;
  handleRemoveImage: (index: number) => void;
  imageLoading: boolean[];
};

export type UseCreateMixtapeResults = {
  checkValues: string[];
  handleClicked: (valueClicked: boolean, value: string) => void;
  valueClicked: boolean;
  mixtapeLoading: boolean;
  handleTrackTitle: (e: FormEvent, index: number) => void;
  handleTitle: (e: FormEvent) => void;
  handleSource: (e: FormEvent) => void;
  handleRemoveTrack: (index: number) => void;
  generateMixtape: () => Promise<void>;
  enabledCurrencies: Erc20[];
  setAudienceType: (e: string) => void;
  audienceType: string;
  setEnabledCurrency: (e: string) => void;
  enabledCurrency: string | undefined;
  setCurrencyDropDown: (e: boolean) => void;
  currencyDropDown: boolean;
  referral: number;
  setReferral: (e: number) => void;
  limit: number;
  setLimit: (e: number) => void;
  value: number;
  setValue: (e: number) => void;
  collectible: string;
  setCollectible: (e: string) => void;
  chargeCollect: string;
  setChargeCollect: (e: string) => void;
  limitedEdition: string;
  setLimitedEdition: (e: string) => void;
  setTimeLimit: (e: string) => void;
  timeLimit: string;
  handleReverseSetCollectValues: (module: any) => void;
};

export type CreateMixtapeProps = {
  checkValues: string[];
  handleClicked: (valueClicked: boolean, value: string) => void;
  valueClicked: boolean;
  dispatch: Dispatch<AnyAction>;
  setAddTrack: ActionCreatorWithPayload<any, "addTrack/setAddTrack">;
  mixtapeLoading: boolean;
  uploadImage: (e: FormEvent, index: number) => Promise<void>;
  handleRemoveImage: (index: number) => void;
  imageArray: string[] | undefined;
  titleArray: string[] | undefined;
  imageLoading: boolean[];
  handleTrackTitle: (e: FormEvent, index: number) => void;
  handleTitle: (e: FormEvent) => void;
  handleSource: (e: FormEvent) => void;
  handleRemoveTrack: (index: number) => void;
  generateMixtape: () => Promise<void>;
  enabledCurrencies: Erc20[];
  setAudienceType: (e: string) => void;
  audienceType: string;
  setEnabledCurrency: (e: string) => void;
  enabledCurrency: string | undefined;
  setCurrencyDropDown: (e: boolean) => void;
  currencyDropDown: boolean;
  referral: number;
  setReferral: (e: number) => void;
  limit: number;
  setLimit: (e: number) => void;
  value: number;
  setValue: (e: number) => void;
  collectible: string;
  setCollectible: (e: string) => void;
  chargeCollect: string;
  setChargeCollect: (e: string) => void;
  limitedEdition: string;
  setLimitedEdition: (e: string) => void;
  setTimeLimit: (e: string) => void;
  timeLimit: string;
  titleValue: string;
  sourceValue: string;
};

export type TrackInputProps = {
  index: number;
  uploadImage: (e: FormEvent, index: number) => Promise<void>;
  handleRemoveImage: (index: number) => void;
  imageLoading: boolean[];
  titleArray: string[];
  imageArray: string[];
  handleTrackTitle: (e: FormEvent, index: number) => void;
  handleRemoveTrack: (index: number) => void;
  mixtapeLoading: boolean;
};

export type RecordProps = {
  index: number;
  recordImage: string;
};

export type useLensSignInResults = {
  handleLensLogin: () => Promise<void>;
  authStatus: boolean;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  lensProfile: Profile | undefined;
  handleRefreshProfile: () => Promise<void>;
};

export type LensSignInProps = {
  handleAction?: () => any;
  isLoading?: boolean;
};

export type AuthSwitchProps = {
  connected: boolean;
  dispatch: Dispatch<AnyAction>;
};

export type ProfileProps = {
  dispatch: Dispatch<AnyAction>;
  lensProfile: Profile | undefined;
  authStatus: boolean;
  newNotifications: boolean;
};

export type PostOptionsProps = {
  dispatch: Dispatch<AnyAction>;
  imagePicker: string | undefined;
  uploadImage: (e: FormEvent | File, canvas?: boolean) => Promise<void>;
  imageUploading: boolean;
  postLoading: boolean;
  videoUploading: boolean;
  uploadVideo: (e: FormEvent) => Promise<void>;
};

export type ImageUploadProps = {
  handleRemoveImage: (e: UploadedMedia) => void;
  postLoading: boolean;
  postImagesDispatched?: UploadedMedia[];
};

export type ImageUploadResults = {
  uploadImage: (e: FormEvent | File, canvas?: boolean) => Promise<void>;
  imageUploading: boolean;
  mappedFeaturedFiles: UploadedMedia[] | undefined;
  handleRemoveImage: (e: UploadedMedia) => void;
  videoUploading: boolean;
  uploadVideo: (e: FormEvent) => Promise<void>;
};

export type ImagePickerProps = {
  imagePicker: string;
  handleEmoji: (e: any) => void;
  handleGif: (e: FormEvent) => void;
  handleGifSubmit: (e: FormEvent) => Promise<void>;
  searchGif: string | undefined;
  results: any[];
  handleSetGif: (result: string) => void;
};

export type GridProps = {
  handleGif: (e: FormEvent) => void;
  handleGifSubmit: (e: FormEvent) => Promise<void>;
  searchGif?: string | undefined;
  results: any[];
  handleSetGif: (result: string) => void;
  width?: string;
  background?: string;
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
  mixtape?: boolean;
};

export type UseCollectionModalResults = {
  enabledCurrencies: Erc20[];
  audienceTypes: string[];
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
  handleCollectValues: () => void;
};

export type CollectOptionsModalProps = {
  enabledCurrencies: Erc20[];
  dispatch: Dispatch<AnyAction>;
  audienceTypes: string[];
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
  handleCollectValues: () => void;
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
  mixtape?: boolean;
};

export interface PostImage {
  item: string;
  type: string;
  altTag: string;
}

export type PostArgsType = {
  profileId: string;
  contentURI: string;
  collectModule: string;
  collectModuleInitData: string;
  referenceModule: string;
  referenceModuleInitData: string;
  sig: {
    v: number;
    r: string;
    s: string;
    deadline: number;
  };
};

export interface CollectValueType {
  freeCollectModule?: {
    followerOnly: boolean;
  };
  revertCollectModule?: boolean;
  feeCollectModule?: {
    amount: {
      currency: string;
      value: string;
    };
    recipient: string;
    referralFee: number;
    followerOnly: boolean;
  };
  limitedFeeCollectModule?: {
    collectLimit: string;
    amount: {
      currency: string;
      value: string;
    };
    recipient: string;
    referralFee: number;
    followerOnly: boolean;
  };
  limitedTimedFeeCollectModule?: {
    collectLimit: string;
    amount: {
      currency: string;
      value: string;
    };
    recipient: string;
    referralFee: number;
    followerOnly: boolean;
  };
  timedFeeCollectModule?: {
    amount: {
      currency: string;
      value: string;
    };
    recipient: string;
    referralFee: number;
    followerOnly: boolean;
  };
}

export type DisconnectProps = {
  dispatch: Dispatch<AnyAction>;
};

export type CollectsModalProps = {
  collectors: WhoCollectedPublicationRequest[];
  getMorePostCollects: () => Promise<void>;
  approveCurrency?: () => void;
  handleCollect?: () => Promise<void>;
  collectInfoLoading: boolean;
  postCollectInfoLoading: boolean;
  collectLoading: boolean;
  approvalLoading: boolean;
};

export type MirrorsModalProps = {
  mirrorers: ProfileQueryRequest[];
  getMorePostMirrors: () => Promise<void>;
  mirrorPost: () => Promise<void>;
  mirrorLoading: boolean;
  mirrorInfoLoading: boolean;
};

export type CommentsModalProps = {
  commentors: PublicationSearchResult[];
  getMorePostComments: () => Promise<void>;
  hasMirrored: boolean[];
  hasReacted: boolean[];
  commentInfoLoading: boolean;
  hasCommented: boolean[];
  reactionsFeed: any[];
  handleHidePost: (id: string, dispatch: Dispatch<AnyAction>) => Promise<void>;
  isMixtape: boolean;
  reactionLoaded: boolean[];
};

export type ReactionModalProps = {
  getMorePostReactions: () => Promise<void>;
  reacters: ReactionRequest[];
  reactionPost: () => Promise<void>;
  reactionLoading: boolean;
  reactionInfoLoading: boolean;
};

export type CollectInfoProps = {
  buttonText: string;
  showText: boolean;
  type?: string;
  symbol?: string;
  value?: string;
  usd?: number;
  limit?: string;
  time?: string;
  totalCollected?: number;
  canClick?: boolean;
  isApproved?: boolean;
  approveCurrency?: () => void;
  handleCollect?: () => Promise<void>;
  collectLoading: boolean;
  approvalLoading?: boolean;
};

export interface ApprovalArgs {
  to: string;
  from: string;
  data: string;
}

export type TransactionProps = {
  inputText: string;
};

export type FollowModalProps = {
  dispatch: Dispatch<AnyAction>;
  followersLoading: boolean;
  followingLoading: boolean;
  userFollowing: PaginatedFollowingResult[];
  userFollowers: PaginatedFollowersResult[];
  getMoreFollowers: () => Promise<void>;
  type: string | undefined;
  getMoreFollowing: () => Promise<void>;
};

export type IndexingModalProps = {
  message: string | undefined;
};

export type NotificationBannerProps = {
  notification: any;
};

export type CollectOptionsMixtapeProps = {
  enabledCurrencies: Erc20[];
  setAudienceType: (e: string) => void;
  audienceType: string;
  setEnabledCurrency: (e: string) => void;
  enabledCurrency: string | undefined;
  setCurrencyDropDown: (e: boolean) => void;
  currencyDropDown: boolean;
  referral: number;
  setReferral: (e: number) => void;
  limit: number;
  setLimit: (e: number) => void;
  value: number;
  setValue: (e: number) => void;
  collectible: string;
  setCollectible: (e: string) => void;
  chargeCollect: string;
  setChargeCollect: (e: string) => void;
  limitedEdition: string;
  setLimitedEdition: (e: string) => void;
  setTimeLimit: (e: string) => void;
  timeLimit: string;
};

export type MixCheckCollectProps = {
  handleClicked: (e: string) => void;
  valueClicked: string | string[];
  label: string;
  col: string;
  row: string;
};

export type HotPublicationProps = {
  height: string;
  width?: string;
  data: any;
  index: number;
  image: string;
  hasReacted?: boolean | undefined;
  reactionsFeed?: number;
  hasMirrored?: boolean | undefined;
  hasCommented?: boolean | undefined;
  dispatch: Dispatch<AnyAction>;
  handleHidePost: (id: string, dispatch: Dispatch<AnyAction>) => Promise<void>;
  followerOnly: boolean;
  reactionLoaded: boolean;
};

export type MixtapePublicationProps = {
  publication: PublicationSearchResult;
  dispatch: Dispatch<AnyAction>;
  type?: string;
  hasReacted?: boolean | undefined;
  reactionsFeed?: number;
  hasMirrored?: boolean | undefined;
  hasCommented?: boolean | undefined;
  handleHidePost: (id: string, dispatch: Dispatch<AnyAction>) => Promise<void>;
  followerOnly: boolean;
  reactionLoaded: boolean;
};

export type TagsProps = {
  tags: string[];
  handleTags: (e: FormEvent) => void;
  handleRemoveTag: (tag: string) => void;
};

export type SearchBarProps = {
  width?: string;
  handleKeyDown: (e: any) => void;
  handleOnChange: (e: FormEvent) => void;
  borderColor: string;
  bg: string;
  bgOpacity?: boolean;
  textColor: string;
  searchTarget: string;
  searchLoading?: boolean;
  height: string;
  textSize: string;
  loaderSize: number;
  text?: string;
};

export type CanvasOptionProps = {
  bool_option?: boolean;
  string_option?: string;
  image: string;
  bgColor?: string;
  setShowBool?: (bool_option: boolean) => void;
  setShowString?: (string_option: string) => void;
  width: number;
  height: number;
  color?: boolean;
  text?: string;
};

export enum MediaType {
  Video,
  Image,
  Gif,
}

export interface UploadedMedia {
  cid: string;
  type: MediaType;
}

export type AccountFollowCheckProps = {
  handleClicked: (valueClicked: string) => void;
  valueClicked: string;
  row: string;
  col: string;
  label: string;
  currentValue: string;
};

export type FollowTypeModalProps = {
  followInfoLoading: boolean;
  followTypedData: () => Promise<void>;
  approveCurrency?: () => Promise<void>;
  approvalLoading: boolean;
  followLoading: boolean;
};

export type FollowInfoProps = {
  approvalLoading?: boolean;
  type: string;
  followLoading?: boolean;
  usd?: number;
  value?: string;
  symbol?: string;
  followTypedData?: () => Promise<void>;
  approveCurrency?: () => Promise<void>;
  isApproved?: boolean;
  buttonText?: string;
};

export type ProfileSideBarProps = {
  publication: PublicationSearchResult;
  mixtapeMirror?: boolean;
  reactionsFeed: number | undefined;
  setReactionState: ActionCreatorWithPayload<
    any,
    "reactionState/setReactionState"
  >;
  handleHidePost: (id: string, dispatch: Dispatch<AnyAction>) => Promise<void>;
  followerOnly: boolean | undefined;
  dispatch: Dispatch<AnyAction>;
  setCommentShow: ActionCreatorWithPayload<any, "commentShow/setCommentShow">;
  hasCommented: boolean | undefined;
  hasMirrored: boolean | undefined;
  hasReacted: boolean | undefined;
  mixtape: boolean;
  reactionLoaded: boolean;
};

export type CassetteButton = {
  text: string;
  textSize: string;
  right: string;
  bottom: string;
  position: string;
  loading?: boolean;
  handleSend?: (e: boolean) => Promise<void>;
  value?: string;
  keyExists?: boolean;
  canvasType?: boolean;
  synthElement?: boolean;
  localRunning?: boolean;
  apiType?: boolean;
  clickable?: boolean;
  clickChange?: (e: any) => void;
  max?: number;
  min?: number;
  dropDown?: boolean;
  setDropOpen?: (e: boolean) => void;
  dropOpen?: boolean;
  scroll?: boolean;
  width?: string;
};
