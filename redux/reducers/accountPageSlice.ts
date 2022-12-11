import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AccountPageState {
  value?: string;
}

const initialAccountPageState: AccountPageState = {
  value: "account",
};

export const AccountPageSlice = createSlice({
  name: "account page",
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

export const { setAccountPage } = AccountPageSlice.actions;

export default AccountPageSlice.reducer;
