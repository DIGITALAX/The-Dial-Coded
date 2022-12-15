import { Post } from "../../../../../../Common/types/lens.types";

export type MainProps = {
  publicationsFeed: Post[];
};

export type HotProps = {
  topMixtape: string[];
  topTracks: string[];
  topTrending: string[];
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
  fetchMorePublications: () => Promise<void>;
}

export type FeedPublicationProps = {

}