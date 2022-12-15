import { Post, Profile } from "../../../../Common/types/lens.types";

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
  publicationsFeed: Post[];
  fetchMorePublications: () => Promise<void>;
  hasMoreBoolean: boolean;
};
