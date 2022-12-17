import { createSlice } from "@reduxjs/toolkit";

export interface PostCollectValuesState {
  type?: string;
  followerOnly?: boolean;
  limit?: string;
  recipient?: string;
  referralFee?: number;
  endTime?: string;
  amount?: {
    asset?: {
      address: string;
      decimals: number;
      name: string;
      symbol: string;
    };
    value?: string;
  };
}

const initialPostCollectValuesState: PostCollectValuesState = {
  type: "FreeCollectModuleSettings",
  followerOnly: false,
};

export const postCollectValuesSlice = createSlice({
  name: "postCollectValues",
  initialState: initialPostCollectValuesState,
  reducers: {
    setPostCollectValues: (
      state: PostCollectValuesState,
      {
        payload: {
          actionType,
          actionFollowerOnly,
          actionLimit,
          actionRecipient,
          actionReferralFee,
          actionEndTime,
          actionAmount
        },
      }
    ) => {
      state.type = actionType;
      state.followerOnly = actionFollowerOnly;
      state.limit = actionLimit;
      state.recipient = actionRecipient;
      state.referralFee = actionReferralFee;
      state.endTime = actionEndTime;
      state.amount = actionAmount;
    },
  },
});

export const { setPostCollectValues } = postCollectValuesSlice.actions;

export default postCollectValuesSlice.reducer;
