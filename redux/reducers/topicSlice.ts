import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface TopicState {
  value: string;
}

const initialTopicState: TopicState = {
  value: "in the style of",
};

export const topicSlice = createSlice({
  name: "topic",
  initialState: initialTopicState,
  reducers: {
    setTopic: (state: TopicState, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

export const { setTopic } = topicSlice.actions;

export default topicSlice.reducer;
