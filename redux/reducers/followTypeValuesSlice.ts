import { createSlice } from "@reduxjs/toolkit";

export interface FollowTypeValuesState {
  type?: any;
  currency?: string;
  address?: string;
  value?: string;
  usd?: number;
  isApproved?: boolean;
  approvedAmount?: number;
  modal: boolean;
}

const initialFollowTypeValuesState: FollowTypeValuesState = {
  type: null,
  modal: false,
};

export const followTypeValuesSlice = createSlice({
  name: "followTypeValues",
  initialState: initialFollowTypeValuesState,
  reducers: {
    setFollowTypeValues: (
      state: FollowTypeValuesState,
      {
        payload: {
          actionType,
          actionCurrency,
          actionAddress,
          actionValue,
          actionUSD,
          actionApproved,
          actionModal,
        },
      }
    ) => {
      state.type = actionType;
      state.currency = actionCurrency;
      state.address = actionAddress;
      state.value = actionValue;
      state.usd = actionUSD;
      state.isApproved = actionApproved;
      state.modal = actionModal;
    },
  },
});

export const { setFollowTypeValues } = followTypeValuesSlice.actions;

export default followTypeValuesSlice.reducer;
