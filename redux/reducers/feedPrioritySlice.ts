import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FeedPriorityState {
  value?: string;
}

const initialFeedPriorityState: FeedPriorityState = {
  value: "interests",
};

export const feedPrioritySlice = createSlice({
  name: "feedPriority",
  initialState: initialFeedPriorityState,
  reducers: {
    setFeedPriority: (state: FeedPriorityState, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

export const { setFeedPriority } = feedPrioritySlice.actions;

export default feedPrioritySlice.reducer;
