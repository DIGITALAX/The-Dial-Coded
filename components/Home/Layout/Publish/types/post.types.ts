import { AnyAction, Dispatch } from "redux";
import {
  Profile,
  PublicationSearchResult,
  PublicationsQueryRequest,
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
  hotFeed: PublicationsQueryRequest[];
  hasHotReacted: boolean[];
  hasHotCommented: boolean[];
  hasHotMirrored: boolean[];
  hotReactionsFeed: any[];
  fetchMoreMixtapes: () => Promise<void>;
  publicationsFeed: PublicationSearchResult[];
  fetchMore: () => Promise<void>;
  hasReacted: boolean[];
  reactionsFeed: any[];
  hasMirrored: boolean[];
  hasCommented: boolean[];
  noUserData: boolean;
  mixtapeMirror: boolean[];
  handleHidePost: (id: string, dispatch: Dispatch<AnyAction>) => Promise<void>;
  followerOnly: boolean[]
};
