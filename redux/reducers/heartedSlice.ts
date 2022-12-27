import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface HeartedState {
  direction?: string;
  id?: string;
  updated?: boolean;
}

const initialHeartedState: HeartedState = {
  direction: undefined,
  id: undefined,
};

export const heartedSlice = createSlice({
  name: "hearted",
  initialState: initialHeartedState,
  reducers: {
    setHearted: (
      state: HeartedState,
      { payload: { actionDirection, actionId } }
    ) => {
      state.direction = actionDirection;
      state.id = actionId;
    },
  },
});

export const { setHearted } = heartedSlice.actions;

export default heartedSlice.reducer;
