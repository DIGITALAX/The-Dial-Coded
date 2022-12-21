import { AnyAction, Dispatch } from "redux";
import { PublicationsQueryRequest } from "../../../Common/types/lens.types";

export type MainPostProps = {
  publicationData: any;
  fetchReactions: (id: string) => Promise<any>;
  didMirror: any[];
  getMoreMirrors: () => Promise<void>;
};

export type CommentsProps = {
  commentors: PublicationsQueryRequest[];
  getMorePostComments: (pubId?: string) => Promise<void>;
  dispatch: Dispatch<AnyAction>;
  didMirror: any[];
  getMoreMirrors: () => Promise<void>;
  lensProfile: string;
  isConnected: boolean;
};
