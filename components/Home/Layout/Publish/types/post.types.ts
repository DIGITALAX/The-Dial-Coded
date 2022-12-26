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
  fetchMore: () => Promise<void>;
  hasReacted: boolean[];
  reactionsFeed: any[];
  hasMirrored: boolean[];
  hasCommented: boolean[];
};
