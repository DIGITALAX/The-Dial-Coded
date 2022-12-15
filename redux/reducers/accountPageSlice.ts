import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AccountPageState {
  value?: string;
}

const initialAccountPageState: AccountPageState = {
  value: "account",
};

export const accountPageSlice = createSlice({
  name: "accountPage",
  initialState: initialAccountPageState,
  reducers: {
    setAccountPage: (
      state: AccountPageState,
      action: PayloadAction<string>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setAccountPage } = accountPageSlice.actions;

export default accountPageSlice.reducer;
