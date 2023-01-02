import { FormEvent } from "react";
import { AnyAction, Dispatch } from "redux";
import { PublicationSearchResult } from "../../../Common/types/lens.types";

export type MainPostProps = {
  publicationData: any;
  hasPostMirrored: boolean[];
  hasPostCommented: boolean[];
  hasPostReacted: boolean[];
  reactionsPostFeed: any[];
  handleHidePost: (id: string, dispatch: Dispatch<AnyAction>) => Promise<void>;
};

export type CommentsProps = {
  commentors: PublicationSearchResult[];
  getMorePostComments: () => Promise<void>;
  dispatch: Dispatch<AnyAction>;
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
  commentSuccess: boolean;
  hasMirrored: boolean[];
  hasReacted: boolean[];
  hasCommented: boolean[];
  handleRemoveGif: (result: any) => void;
  gifs: string[];
  reactionsFeed: any[];
  handleHidePost: (id: string, dispatch: Dispatch<AnyAction>) => Promise<void>;
  tags: string[];
  handleTags: (e: FormEvent) => void;
  handleRemoveTag: (tag: string) => void;
};
