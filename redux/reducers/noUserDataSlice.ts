import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface NoUserDataState {
  value: boolean;
}

const initialNoUserDataState: NoUserDataState = {
  value: false,
};

export const noUserDataSlice = createSlice({
  name: "noUserData",
  initialState: initialNoUserDataState,
  reducers: {
    setNoUserData: (
      state: NoUserDataState,
      action: PayloadAction<boolean>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setNoUserData } = noUserDataSlice.actions;

export default noUserDataSlice.reducer;
