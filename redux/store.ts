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
});

export const store = configureStore({
  reducer: {
    app: reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
