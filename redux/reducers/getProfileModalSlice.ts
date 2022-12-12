import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface GetProfileModalState {
  value?: boolean;
}

const initialGetProfileModalState: GetProfileModalState = {
  value: false,
};

export const getProfileModalSlice = createSlice({
  name: "get Profile Modal",
  initialState: initialGetProfileModalState,
  reducers: {
    setGetProfileModal: (state: GetProfileModalState, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
  },
});

export const { setGetProfileModal } = getProfileModalSlice.actions;

export default getProfileModalSlice.reducer;
