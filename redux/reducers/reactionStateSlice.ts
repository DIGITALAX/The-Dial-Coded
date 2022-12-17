import { createSlice } from "@reduxjs/toolkit";

export interface ReactionStateState {
  open: boolean;
  type?: string;
  value?: any;
}

const initialReactionStateState: ReactionStateState = {
  open: false,
  type: undefined,
  value: undefined
};

export const reactionStateSlice = createSlice({
  name: "reactionState",
  initialState: initialReactionStateState,
  reducers: {
    setReactionState: (
      state: ReactionStateState,
      { payload: { actionOpen, actionType, actionValue } }
    ) => {
      state.open = actionOpen;
      state.type = actionType;
      state.value = actionValue;
    },
  },
});

export const { setReactionState } = reactionStateSlice.actions;

export default reactionStateSlice.reducer;
