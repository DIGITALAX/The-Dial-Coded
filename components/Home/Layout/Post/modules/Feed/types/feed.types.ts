import { Post, ReactionRequest } from "../../../../../../Common/types/lens.types";

export type MainProps = {
  publicationsFeed: Post[];
  fetchMorePublications: () => Promise<void>;
  isOpen: boolean;
  fetchReactions: (id: string) => Promise<number | void>
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
  fetchReactions: (id: string) => Promise<number | void>
};

export type ParametersProps = {
  setFeedType: (e: string[]) => void;
  setSortCriteria: (e: string) => void;
};
