import { AnyAction, Dispatch } from "redux";
import {
  Profile,
  PublicationSearchResult,
  PublicationsQueryRequest,
} from "../../../../../../Common/types/lens.types";

export type MainProps = {
  publicationsFeed: PublicationSearchResult[];
  fetchMore: () => Promise<void>;
  isOpen: boolean;
  viewerFeed: Profile | undefined;
  hasReacted: boolean[];
  reactionsFeed: any[];
  hasMirrored: boolean[];
  hasCommented: boolean[];
  noUserData: boolean;
  mixtapeMirror: boolean[];
  handleHidePost: (id: string, dispatch: Dispatch<AnyAction>) => Promise<void>;
  followerOnly: boolean[];
  publicationsLoading: boolean;
  firstPubLoad: boolean;
  mixtapeLength: number;
  noHotData: boolean;
};

export type HotProps = {
  isOpen: boolean;
  hotFeed: PublicationsQueryRequest[];
  hasHotReacted: boolean[];
  hasHotCommented: boolean[];
  hasHotMirrored: boolean[];
  hotReactionsFeed: any[];
  fetchMoreMixtapes: () => Promise<void>;
  dispatch: Dispatch<AnyAction>;
  handleHidePost: (id: string, dispatch: Dispatch<AnyAction>) => Promise<void>;
  mixtapesLoading: boolean;
  firstMixLoad: boolean;
  hotFollowerOnly: boolean[];
  noHotData: boolean;
};

export type UseHotResults = {
  hotFeed: PublicationsQueryRequest[];
  hasHotReacted: boolean[];
  hasHotCommented: boolean[];
  hasHotMirrored: boolean[];
  hotReactionsFeed: any[];
  fetchMoreMixtapes: () => Promise<void>;
  mixtapesLoading: boolean;
  firstMixLoad: boolean;
  followerOnly: boolean[];
};

export type UseMainResults = {
  setFeedType: (e: string[]) => void;
  setSortCriteria: (e: string) => void;
  fetchMoreFeed: () => Promise<void>;
  publicationsFeed: PublicationSearchResult[];
  fetchReactions: (id: string) => Promise<any>;
  getMoreFeedTimeline: () => Promise<void>;
  collectInfoLoading: boolean;
  getMirrors: () => Promise<void>;
  hasReacted: boolean[];
  reactionsFeed: any[];
  handleHidePost: (id: string, dispatch: Dispatch<AnyAction>) => Promise<void>;
  publicationsLoading: boolean;
  firstPubLoad: boolean;
};
