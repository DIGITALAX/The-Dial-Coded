import { FormEvent } from "react";
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
  commentPost: (e: FormEvent) => Promise<void>;
  commentLoading: boolean;
  handleCommentDescription: (e: FormEvent) => void;
  handleEmoji: (e: FormEvent) => void;
  handleGif: (e: FormEvent) => void;
  handleSetGif: (result: any) => void;
  results: any;
  searchGif: string | undefined;
  handleGifSubmit: (e: FormEvent) => Promise<void>;
  commentDescription: string;
};
