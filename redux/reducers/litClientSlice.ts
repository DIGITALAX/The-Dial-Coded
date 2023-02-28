import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface LitClientState {
  client?: any;
  decrypt?: any;
}

const initialLitClientState: LitClientState = {
  client: undefined,
  decrypt: undefined,
};

export const litClientSlice = createSlice({
  name: "litClient",
  initialState: initialLitClientState,
  reducers: {
    setLitClient: (
      state: LitClientState,
      { payload: { actionClient, actionDecrypt } }
    ) => {
      state.client = actionClient;
      state.decrypt = actionDecrypt;
    },
  },
});

export const { setLitClient } = litClientSlice.actions;

export default litClientSlice.reducer;
