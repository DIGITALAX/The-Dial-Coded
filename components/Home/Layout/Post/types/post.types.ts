import {
  Post,
  Profile,
  PublicationQueryRequest,
  ReactionRequest,
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
  publicationsFeed: PublicationQueryRequest[];
  fetchMorePublications: () => Promise<void>;
  fetchReactions: (id: string) => Promise<number | void>
  getMoreFeedTimeline:  () => Promise<void>;
};
