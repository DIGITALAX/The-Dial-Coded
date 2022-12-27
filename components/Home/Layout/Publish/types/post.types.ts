import {
  Profile,
  PublicationSearchResult,
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
  publicationsFeed: PublicationSearchResult[];
  fetchMore: () => Promise<void>;
  hasReacted: boolean[];
  reactionsFeed: any[];
  hasMirrored: boolean[];
  hasCommented: boolean[];
};
