import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FollowerOnlyState {
  value?: boolean;
}

const initialFollowerOnlyState: FollowerOnlyState = {
  value: false,
};

export const followerOnlySlice = createSlice({
  name: "followerOnly",
  initialState: initialFollowerOnlyState,
  reducers: {
    setFollowerOnly: (
      state: FollowerOnlyState,
      action: PayloadAction<boolean>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setFollowerOnly } = followerOnlySlice.actions;

export default followerOnlySlice.reducer;
