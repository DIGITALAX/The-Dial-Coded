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
import saveMixtapeReducer from "./reducers/saveMixtapeSlice";
import addTrackReducer from "./reducers/addTrackSlice";
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
import followModalReducer from "./reducers/followModalSlice";
import indexModalReducer from "./reducers/indexModalSlice";
import heartedReducer from "./reducers/heartedSlice";
import noUserDataReducer from "./reducers/noUserDataSlice";
import notificationsReducer from "./reducers/notificationsSlice";
import mixtapeTitleReducer from "./reducers/mixtapeTitleSlice";
import mixtapeSourceReducer from "./reducers/mixtapeSourceSlice";
import completeTrackReducer from "./reducers/completeTrackSlice";
import chosenDMProfileReducer from "./reducers/chosenDMProfileSlice";
import preSearchReducer from "./reducers/preSearchSlice";
import lexicaImagesReducer from "./reducers/lexicaImagesSlice";
import searchTargetReducer from "./reducers/searchTargetSlice";
import searchCategoriesReducer from "./reducers/searchCategoriesSlice";
import followerOnlyReducer from "./reducers/followerOnlySlice";
import xmtpClientReducer from "./reducers/xmtpClientSlice";
import draftTitleReducer from "./reducers/draftTitleSlice";
import draftElementsReducer from "./reducers/draftElementsSlice";
import dispatcherReducer from "./reducers/dispatcherSlice";
import mixtapesReducer from "./reducers/mixtapesSlice";

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
  saveMixtapeReducer,
  addTrackReducer,
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
  insufficientFundsReducer,
  followModalReducer,
  indexModalReducer,
  heartedReducer,
  noUserDataReducer,
  notificationsReducer,
  mixtapeSourceReducer,
  mixtapeTitleReducer,
  completeTrackReducer,
  chosenDMProfileReducer,
  preSearchReducer,
  lexicaImagesReducer,
  searchTargetReducer,
  searchCategoriesReducer,
  followerOnlyReducer,
  xmtpClientReducer,
  draftElementsReducer,
  draftTitleReducer,
  dispatcherReducer,
  mixtapesReducer
});

export const store = configureStore({
  reducer: {
    app: reducer,
  },
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
