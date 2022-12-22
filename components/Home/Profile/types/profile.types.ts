import { AnyAction, Dispatch } from "redux";
import {
  Profile,
  PublicationsQueryRequest,
} from "../../../Common/types/lens.types";

export type SideBarProps = {
  profileData: Profile;
  followLoading: boolean;
  followProfile: () => Promise<void>;
  unFollowProfile: () => Promise<void>;
  isFollowedByMe: boolean;
  isFollowing: boolean;
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
  userFeed: PublicationsQueryRequest[];
  followArgs: FollowArgs | undefined;
  dispatch: Dispatch<AnyAction>;
  isFollowedByMe: boolean;
  isFollowing: boolean;
};
