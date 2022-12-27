import { createSlice } from "@reduxjs/toolkit";

export interface followModalState {
  open?: boolean;
  type?: string;
}

const initialFollowModalState: followModalState = {
  open: false,
  type: undefined,
};

export const followModalSlice = createSlice({
  name: "followModal",
  initialState: initialFollowModalState,
  reducers: {
    setFollowModal: (
      state: followModalState,
      { payload: { actionOpen, actionType } }
    ) => {
      state.open = actionOpen;
      state.type = actionType;
    },
  },
});

export const { setFollowModal } = followModalSlice.actions;

export default followModalSlice.reducer;
