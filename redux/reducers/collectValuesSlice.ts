import { createSlice } from "@reduxjs/toolkit";
import { Erc20 } from "../../components/Common/types/lens.types";

export interface CollectValuesState {
  follower?: string;
  revert?: string;
  amount?: number;
  currency?: Erc20;
  referral?: number;
  limited?: string;
  editions?: number;
  time?: string;
}

const initialCollectValuesState: CollectValuesState = {
  follower: undefined,
  revert: undefined,
  amount: undefined,
  currency: undefined,
  referral: undefined,
  limited: undefined,
  editions: undefined,
  time: undefined,
};

export const collectValuesSlice = createSlice({
  name: "collect values",
  initialState: initialCollectValuesState,
  reducers: {
    setCollectValues: (
      state: CollectValuesState,
      {
        payload: {
          actionFollower,
          actionRevert,
          actionAmount,
          actionCurrency,
          actionReferral,
          actionLimited,
          actionEditions,
          actionTime,
        },
      }
    ) => {
      state.follower = actionFollower;
      state.revert = actionRevert;
      state.amount = actionAmount;
      state.currency = actionCurrency;
      state.referral = actionReferral;
      state.limited = actionLimited;
      state.editions = actionEditions;
      state.time = actionTime;
    },
  },
});

export const { setCollectValues } = collectValuesSlice.actions;

export default collectValuesSlice.reducer;
