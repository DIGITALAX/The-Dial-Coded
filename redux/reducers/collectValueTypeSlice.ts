import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CollectValueType } from "../../components/Common/types/common.types";

export interface CollectValueTypeState {
  type?: CollectValueType;
}

const initialCollectValueState: CollectValueTypeState = {
  type: {
    freeCollectModule: {
      followerOnly: false,
    },
  },
};

export const collectValueTypeSlice = createSlice({
  name: "collect values",
  initialState: initialCollectValueState,
  reducers: {
    setCollectValueType: (
      state: CollectValueTypeState,
      action: PayloadAction<CollectValueType>
    ) => {
      state.type = action.payload;
    },
  },
});

export const { setCollectValueType } = collectValueTypeSlice.actions;

export default collectValueTypeSlice.reducer;
