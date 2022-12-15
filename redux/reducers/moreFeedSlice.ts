import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MoreFeedState {
  value: boolean;
}

const initialMoreFeedState: MoreFeedState = {
  value: false,
};

export const moreFeedSlice = createSlice({
  name: "more feed",
  initialState: initialMoreFeedState,
  reducers: {
    setMoreFeed: (
      state: MoreFeedState,
      action: PayloadAction<boolean>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setMoreFeed } = moreFeedSlice.actions;

export default moreFeedSlice.reducer;
