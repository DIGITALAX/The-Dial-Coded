import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface InsufficientFundsState {
  value?: string;
}

const initialInsufficientFundsState: InsufficientFundsState = {
  value: undefined,
};

export const insufficientFundsSlice = createSlice({
  name: "insufficientFunds",
  initialState: initialInsufficientFundsState,
  reducers: {
    setInsufficientFunds: (
      state: InsufficientFundsState,
      action: PayloadAction<string>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setInsufficientFunds } = insufficientFundsSlice.actions;

export default insufficientFundsSlice.reducer;
