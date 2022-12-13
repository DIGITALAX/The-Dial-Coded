import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CollectOptionsModalState {
  value?: boolean;
}

const initialCollectOptionsModalState: CollectOptionsModalState = {
  value: false,
};

export const collectOptionsModalSlice = createSlice({
  name: "collect options Modal",
  initialState: initialCollectOptionsModalState,
  reducers: {
    setCollectOptionsModal: (state: CollectOptionsModalState, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
  },
});

export const { setCollectOptionsModal } = collectOptionsModalSlice.actions;

export default collectOptionsModalSlice.reducer;
