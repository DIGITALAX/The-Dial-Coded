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
  usd?: number;
  canCollect?: boolean;
  isApproved?: boolean;
  totalCollects?: number;
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
          actionAmount,
          actionUSD,
          actionCanCollect,
          actionApproved,
          actionTotalCollects,
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
      state.usd = actionUSD;
      state.canCollect = actionCanCollect;
      state.isApproved = actionApproved;
      state.totalCollects = actionTotalCollects;
    },
  },
});

export const { setPostCollectValues } = postCollectValuesSlice.actions;

export default postCollectValuesSlice.reducer;
