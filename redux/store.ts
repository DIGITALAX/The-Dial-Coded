import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import layoutReducer from "./reducers/layoutSlice";
import publicationReducer from "./reducers/publicationSlice";
import dialReducer from "./reducers/dialSlice";
import videoReducer from "./reducers/videoSlice";
import backgroundReducer from "./reducers/backgroundSlice";
import topicReducer from "./reducers/topicSlice";
import feedOrderReducer from "./reducers/feedOrderSlice";
import feedPriorityReducer from "./reducers/feedPrioritySlice";
import feedTypeReducer from "./reducers/feedTypeSlice";
import userViewerReducer from "./reducers/userViewSlice";
import moreFeedReducer from "./reducers/moreFeedSlice";
import accountPageReducer from "./reducers/accountPageSlice";
import mixtapePageReducer from "./reducers/mixtapePageSlice";
import mixtapeCheckReducer from "./reducers/mixtapeCheckSlice";
import addMixtapeReducer from "./reducers/addMixtapeSlice";
import saveMixtapeReducer from "./reducers/saveMixtapeSlice";
import addTrackReducer from "./reducers/addTrackSlice";
import editTrackReducer from "./reducers/editTrackSlice";
import deleteTrackReducer from "./reducers/deleteTrackSlice";
import lensProfileReducer from "./reducers/lensProfileSlice";
import getProfileModalReducer from "./reducers/getProfileModalSlice";
import signInReducer from "./reducers/signInSlice";
import authStatusReducer from "./reducers/authStatusSlice";
import signInSettledReducer from "./reducers/signInSettledSlice";
import hamburgerReducer from "./reducers/hamburgerSlice";
import collectOptionsReducer from "./reducers/collectOptionsModalSlice";
import emojiPickerReducer from "./reducers/imagePickerSlice";
import collectValueTypeReducer from "./reducers/collectValueTypeSlice";
import postImageReducer from "./reducers/postImagesSlice";
import imageViewerReducer from "./reducers/imageViewerSlice";
import collectNotificationReducer from "./reducers/collectNotificationSlice";
import reactionStateReducer from "./reducers/reactionStateSlice";
import commentShowReducer from "./reducers/commentShowSlice";
import postCollectValuesReducer from "./reducers/postCollectValuesSlice";
import walletConnectedReducer from "./reducers/walletConnectedSlice";
import approvalArgsReducer from "./reducers/approvalArgsSlice";
import commentReducer from "./reducers/commentSlice";
import fireReducer from "./reducers/fireSlice";
import insufficientFundsReducer from "./reducers/insufficientFunds";

const reducer = combineReducers({
  layoutReducer,
  publicationReducer,
  dialReducer,
  videoReducer,
  backgroundReducer,
  topicReducer,
  feedOrderReducer,
  feedPriorityReducer,
  feedTypeReducer,
  userViewerReducer,
  moreFeedReducer,
  accountPageReducer,
  mixtapePageReducer,
  mixtapeCheckReducer,
  addMixtapeReducer,
  saveMixtapeReducer,
  addTrackReducer,
  editTrackReducer,
  deleteTrackReducer,
  lensProfileReducer,
  getProfileModalReducer,
  signInReducer,
  authStatusReducer,
  signInSettledReducer,
  hamburgerReducer,
  collectOptionsReducer,
  emojiPickerReducer,
  collectValueTypeReducer,
  postImageReducer,
  imageViewerReducer,
  collectNotificationReducer,
  reactionStateReducer,
  commentShowReducer,
  postCollectValuesReducer,
  walletConnectedReducer,
  approvalArgsReducer,
  commentReducer,
  fireReducer,
  insufficientFundsReducer
});

export const store = configureStore({
  reducer: {
    app: reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
