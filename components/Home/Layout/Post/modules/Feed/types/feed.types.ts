import { Post, PublicationsQueryRequest } from "../../../../../../Common/types/lens.types";

export type MainProps = {
  publicationsFeed: PublicationsQueryRequest[];
  fetchMorePublications: () => Promise<void>;
  isOpen: boolean;
  fetchReactions: (id: string) => Promise<any>;
  getMoreFeedTimeline:  () => Promise<void>;
  userSelectFeed: any[];
  getMoreUserSelectFeed: () => Promise<void>;
  didMirror: any[];
  getMoreMirrors: () => Promise<void>
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
  publicationsFeed: PublicationsQueryRequest[];
  fetchReactions: (id: string) => Promise<any>;
  getMoreFeedTimeline:  () => Promise<void>;
  collectInfoLoading: boolean;
  didMirror: any[];
  getMoreMirrors: () => Promise<void>
};

export type ParametersProps = {
  setSortCriteria: (e: string) => void;
};
