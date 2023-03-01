import { AnyAction, Dispatch } from "redux";

export type MainPostMixtapeProps = {
  publicationData: any;
  hasPostMirrored: boolean[];
  hasPostCommented: boolean[];
  hasPostReacted: boolean[];
  reactionsPostFeed: any[];
  handleHidePost: (id: string, dispatch: Dispatch<AnyAction>) => Promise<void>;
  followerOnly: boolean;
  reactionLoaded: boolean[]
};
