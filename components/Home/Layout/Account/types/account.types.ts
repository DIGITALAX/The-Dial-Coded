import { FormEvent } from "react";
import { AnyAction, Dispatch } from "redux";
import {
  Attribute,
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
