import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface xmtpClientState {
  value: any;
}

const initialXmtpClientState: xmtpClientState = {
  value: undefined,
};

export const xmtpClientSlice = createSlice({
  name: "xmtpClient",
  initialState: initialXmtpClientState,
  reducers: {
    setXmtpClient: (state: xmtpClientState, action: PayloadAction<any>) => {
      state.value = action.payload;
    },
  },
});

export const { setXmtpClient } = xmtpClientSlice.actions;

export default xmtpClientSlice.reducer;
