import { Post, PublicationQueryRequest } from "../../../../../../Common/types/lens.types";

export type MainProps = {
  publicationsFeed: PublicationQueryRequest[];
  fetchMorePublications: () => Promise<void>;
  isOpen: boolean;
  fetchReactions: (id: string) => Promise<number | void>
  getMoreFeedTimeline:  () => Promise<void>;
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
  publicationsFeed: PublicationQueryRequest[];
  fetchReactions: (id: string) => Promise<number | void>
  getMoreFeedTimeline:  () => Promise<void>;
};

export type ParametersProps = {
  setSortCriteria: (e: string) => void;
};
