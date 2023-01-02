import { AnyAction, Dispatch } from "redux";

export type PublicationsFoundProps = {
  publicationsSearch: any[];
  dispatch: Dispatch<AnyAction>;
  hasMirrored: boolean[];
  hasReacted: boolean[];
  reactionsFeed: any[];
  hasCommented: boolean[];
  mixtapeMirror: boolean[];
  handleHidePost: (id: string, dispatch: Dispatch<AnyAction>) => Promise<void>;
};
