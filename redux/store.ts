import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import layoutReducer from "./reducers/layoutSlice";

const reducer = combineReducers({
  layoutReducer,
});

export const store = configureStore({
  reducer: {
    app: reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
