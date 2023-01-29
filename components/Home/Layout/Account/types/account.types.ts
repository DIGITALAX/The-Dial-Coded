import { DecodedMessage } from "@xmtp/xmtp-js";
import { FormEvent, Ref } from "react";
import { AnyAction, Dispatch } from "redux";
import {
  Attribute,
  Erc20,
  PaginatedFollowersResult,
  PaginatedFollowingResult,
  Profile,
  PublicationSearchResult,
} from "../../../../Common/types/lens.types";

export type UseAccountResult = {
  accountTitles: string[];
  handleTapeSet: (title: string) => void;
  notificationImages: string[];
  profileImage: string | undefined;
  coverImage: string | undefined;
  accountImageUpload: (e: FormEvent) => Promise<void>;
  profileImageUploading: boolean;
  coverImageUploading: boolean;
  accountLoading: boolean;
  setProfileData: (e: FormEvent) => Promise<void>;
  profileImageSet: () => Promise<void>;
  profileLoading: boolean;
  handleFollowModule: () => Promise<void>;
  followLoading: boolean;
  setFollowFee: (e: string) => void;
  followFee: string;
  value: number;
  setValue: (e: number) => void;
  enabledCurrencies: Erc20[];
  setEnabledCurrency: (e: string) => void;
  currencyDropDown: boolean;
  setCurrencyDropDown: (e: boolean) => void;
  enabledCurrency: string | undefined;
};

export type AccountTabProps = {
  profile: Profile | undefined;
  profileImage: string | undefined;
  coverImage: string | undefined;
  accountImageUpload: (e: FormEvent) => Promise<void>;
  profileImageUploading: boolean;
  coverImageUploading: boolean;
  accountLoading: boolean;
  setProfileData: (e: FormEvent) => Promise<void>;
  profileImageSet: () => Promise<void>;
  profileLoading: boolean;
  dispatcher: boolean;
  setDispatcherEnabled: () => Promise<void>;
  dispatcherLoading: boolean;
  handleFollowModule: () => Promise<void>;
  followLoading: boolean;
  setFollowFee: (e: string) => void;
  followFee: string;
  value: number;
  setValue: (e: number) => void;
  enabledCurrencies: Erc20[];
  setEnabledCurrency: (e: string) => void;
  currencyDropDown: boolean;
  setCurrencyDropDown: (e: boolean) => void;
  enabledCurrency: string | undefined;
};

export type ProfileTabProps = {
  getMoreUserProfileFeed: () => Promise<void>;
  userFeed: PublicationSearchResult[];
  dispatch: Dispatch<AnyAction>;
  height: string | undefined;
  hasMirrored: boolean[];
  hasCommented: boolean[];
  hasReacted: boolean[];
  reactionsFeed: any[];
  profileDataLoading?: boolean;
  mixtapeMirror: boolean[];
  handleHidePost: (id: string, dispatch: Dispatch<AnyAction>) => Promise<void>;
  followerOnly: boolean[];
  publicationsLoading: boolean;
};

export type StatsTabProps = {
  profile: Profile | undefined;
  userFollowers: PaginatedFollowersResult[];
  userFollowing: PaginatedFollowingResult[];
  getMoreFollowing: () => Promise<void>;
  getMoreFollowers: () => Promise<void>;
  followersLoading: boolean;
  followingLoading: boolean;
};

export interface AccountData {
  version: string;
  metadata_id: string;
  name: string | null;
  bio: string | null;
  cover_picture: string | null;
  attributes: Attribute[];
  createdOn: Date;
  appId: string;
}

export type ProfileArgsType = {
  profileId: string;
  metadata: string;
  sig: {
    v: number;
    r: string;
    s: string;
    deadline: number;
  };
};

export type ImageArgsType = {
  profileId: string;
  imageURI: string;
  sig: {
    v: number;
    r: string;
    s: string;
    deadline: number;
  };
};

export type FollowProps = {
  follow: any;
};

export type NotificationsProps = {
  getMoreNotifications: () => Promise<void>;
  notificationsList: any[];
  notificationsLoading: boolean;
};

export type MessageProps = {
  sendConversation: () => Promise<void>;
  handleMessage: (e: FormEvent) => void;
  chosenProfile: Profile | undefined;
  conversationMessages: any[];
  message: string;
  textElement: Ref<HTMLTextAreaElement>;
  messageLoading: boolean;
  caretCoord: { x: number; y: number };
  mentionProfiles: any[];
  handleMentionClick: (user: any) => void;
  profilesOpen: boolean;
  handleEmoji: (e: any) => void;
  openImagePicker: string;
  setOpenImagePicker: (e: string) => void;
  conversationLoading: boolean;
  onNetwork: boolean;
  handleGif: (e: FormEvent) => void;
  handleSetGif: (result: any) => void;
  handleGifSubmit: (e: any) => Promise<void>;
  results: any[];
  handleUploadImage: (e: any) => Promise<void>;
  handleKeyEnter: (e: KeyboardEvent) => Promise<void>;
};

export type ConversationsProps = {
  createClient: () => Promise<void>;
  searchMessages: (e: FormEvent) => Promise<void>;
  clientLoading: boolean;
  searchLoading: boolean;
  profileSearch: Profile[];
  searchMoreMessages: () => Promise<void>;
  sendConversation: () => Promise<void>;
  handleMessage: (e: FormEvent) => void;
  handleChosenProfile: (user: Profile) => void;
  searchTarget: string | undefined;
  dropdown: boolean;
  chosenProfile: Profile | undefined;
  previewMessages: Map<string, DecodedMessage> | undefined;
  profileLensData: Profile[];
  conversationMessages: any[];
  message: string;
  textElement: Ref<HTMLTextAreaElement>;
  messageLoading: boolean;
  caretCoord: { x: number; y: number };
  mentionProfiles: any[];
  handleMentionClick: (user: any) => void;
  profilesOpen: boolean;
  handleEmoji: (e: any) => void;
  openImagePicker: string;
  setOpenImagePicker: (e: string) => void;
  conversationLoading: boolean;
  client: any;
  onNetwork: boolean;
  handleGif: (e: FormEvent) => void;
  handleSetGif: (result: any) => void;
  handleGifSubmit: (e: any) => Promise<void>;
  results: any[];
  handleUploadImage: (e: any) => Promise<void>;
  allConversationsLoading: boolean;
  handleKeyEnter: (e: KeyboardEvent) => Promise<void>;
};

export type PreviewProps = {
  previewMessages: Map<string, DecodedMessage> | undefined;
  profileLensData: Profile[];
  handleChosenProfile: (user: Profile) => void;
  allConversationsLoading: boolean;
};

export type UseConversationResults = {
  sendConversation: () => Promise<void>;
  createClient: () => Promise<void>;
  searchMessages: (e: FormEvent) => Promise<void>;
  clientLoading: boolean;
  searchLoading: boolean;
  profileSearch: Profile[];
  searchMoreMessages: () => Promise<void>;
  handleMessage: (e: FormEvent) => void;
  handleChosenProfile: (user: Profile) => void;
  dropdown: boolean;
  previewMessages: Map<string, DecodedMessage> | undefined;
  profileLensData: Profile[];
  conversationMessages: any[];
  message: string;
  textElement: Ref<HTMLTextAreaElement>;
  messageLoading: boolean;
  caretCoord: { x: number; y: number };
  mentionProfiles: any[];
  handleMentionClick: (user: any) => void;
  profilesOpen: boolean;
  handleEmoji: (e: any) => void;
  openImagePicker: string;
  setOpenImagePicker: (e: string) => void;
  conversationLoading: boolean;
  onNetwork: boolean;
  handleGif: (e: FormEvent) => void;
  handleSetGif: (result: any) => void;
  handleGifSubmit: (e: any) => Promise<void>;
  results: any[];
  handleUploadImage: (e: any) => Promise<void>;
  allConversationsLoading: boolean;
  handleKeyEnter: (e: KeyboardEvent) => Promise<void>;
};

export type SearchProps = {
  searchMessages: (e: FormEvent) => Promise<void>;
  searchLoading: boolean;
  profileSearch: Profile[];
  searchMoreMessages: () => Promise<void>;
  handleChosenProfile: (user: Profile) => void;
  searchTarget: string | undefined;
  dropdown: boolean;
};
