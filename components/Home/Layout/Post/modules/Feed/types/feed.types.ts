import { Post } from "../../../../../../Common/types/lens.types";

export type MainProps = {
  publicationsFeed: Post[];
  fetchMorePublications: () => Promise<void>;
  isOpen: boolean;
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
  publicationsFeed: Post[];
};

export type ParametersProps = {
  setFeedType: (e: string[]) => void;
  setSortCriteria: (e: string) => void;
};
