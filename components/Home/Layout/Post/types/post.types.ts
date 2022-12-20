import {
  Profile,
  PublicationsQueryRequest,
} from "../../../../Common/types/lens.types";

export type PostBoxProps = {
  isConnected: boolean;
  openConnectModal: (() => void) | undefined;
  lensProfile: Profile | undefined;
};

export type UsePostResult = {
  connected: boolean;
};

export type FeedProps = {
  topTrending: string[];
  topMixtape: string[];
  topTracks: string[];
  publicationsFeed: PublicationsQueryRequest[];
  fetchMorePublications: () => Promise<void>;
  fetchReactions: (id: string) => Promise<any>;
  getMoreFeedTimeline: () => Promise<void>;
  userSelectFeed: any[];
  getMoreUserSelectFeed: () => Promise<void>;
  didMirror: any[];
  getMoreMirrors: () => Promise<void>
};
