import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface xmtpSearchState {
  value: string;
}

const initialXmtpSearchState: xmtpSearchState = {
  value: "",
};

export const xmtpSearchSlice = createSlice({
  name: "xmtpSearch",
  initialState: initialXmtpSearchState,
  reducers: {
    setXmtpSearch: (state: xmtpSearchState, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

export const { setXmtpSearch } = xmtpSearchSlice.actions;

export default xmtpSearchSlice.reducer;
