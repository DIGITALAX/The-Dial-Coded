import {
  Post,
  PublicationSearchResult,
} from "../../../../../../Common/types/lens.types";

export type MainProps = {
  publicationsFeed: PublicationSearchResult[];
  fetchMore: () => Promise<void>;
  isOpen: boolean;
  viewerFeed: string;
  hasReacted: boolean[];
  reactionsFeed: any[];
  hasMirrored: boolean[];
  hasCommented: boolean[]
};

export type HotProps = {
  topMixtape: string[];
  topTracks: string[];
  topTrending: string[];
  isOpen: boolean;
};

export type UseHotResults = {
  topMixtape: string[];
  topTracks: string[];
  topTrending: string[];
};

export type UseMainResults = {
  setFeedType: (e: string[]) => void;
  setSortCriteria: (e: string) => void;
  fetchMorePublications: () => Promise<void>;
  publicationsFeed: PublicationSearchResult[];
  fetchReactions: (id: string) => Promise<any>;
  getMoreFeedTimeline: () => Promise<void>;
  collectInfoLoading: boolean;
  getMirrors: () => Promise<void>;
  hasReacted: boolean[];
  reactionsFeed: any[];
};
