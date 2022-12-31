import { AnyAction, Dispatch } from "redux";
import {
  PaginatedFollowersResult,
  PaginatedFollowingResult,
  Profile,
  PublicationSearchResult,
} from "../../../Common/types/lens.types";

export type SideBarProps = {
  profileData: Profile;
  followLoading: boolean;
  followProfile: () => Promise<void>;
  unFollowProfile: () => Promise<void>;
  isFollowedByMe: boolean;
  isFollowing: boolean;
  dispatch: Dispatch<AnyAction>;
  getMoreUserMixtapes: () => Promise<void>;
  hotReactionsFeed: any[];
  hasHotReacted: boolean[];
  hasHotMirrored: boolean[];
  hasHotCommented: boolean[];
  mixtapes: any[];
  handleHidePost: (id: string) => Promise<void>;
};

export interface FollowArgs {
  follower: string;
  profileIds: [string];
  datas: [any];
  sig: {
    v: any;
    r: any;
    s: any;
    deadline: any;
  };
}

export type UseProfilePageResults = {
  profileData: Profile;
  followLoading: boolean;
  followProfile: () => Promise<void>;
  unFollowProfile: () => Promise<void>;
  profileDataLoading: boolean;
  getProfileData: (handle: string) => Promise<void>;
  getMoreUserProfileFeed: () => Promise<void>;
  userFeed: PublicationSearchResult[];
  followArgs: FollowArgs | undefined;
  dispatch: Dispatch<AnyAction>;
  isFollowedByMe: boolean;
  isFollowing: boolean;
  hasMirrored: boolean[];
  hasCommented: boolean[];
  hasReacted: boolean[];
  reactionsFeed: any[];
  followersLoading: boolean;
  followingLoading: boolean;
  userFollowing: PaginatedFollowingResult[];
  userFollowers: PaginatedFollowersResult[];
  getMoreFollowers: () => Promise<void>;
  getMoreFollowing: () => Promise<void>;
  getMoreUserMixtapes: () => Promise<void>;
  hotReactionsFeed: any[];
  hasHotReacted: boolean[];
  hasHotMirrored: boolean[];
  hasHotCommented: boolean[];
  mixtapes: any[];
  mixtapeMirror: boolean[];
};
