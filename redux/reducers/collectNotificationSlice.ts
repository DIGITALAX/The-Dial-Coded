import { createSlice } from "@reduxjs/toolkit";

export interface CollectNotificationState {
  open?: boolean;
  type?: string;
}

const initialCollectNotificationState: CollectNotificationState = {
  open: false,
  type: undefined,
};

export const collectNotificationSlice = createSlice({
  name: "collectNotification",
  initialState: initialCollectNotificationState,
  reducers: {
    setCollectNotification: (
      state: CollectNotificationState,
      { payload: { actionOpen, actionType } }
    ) => {
      state.open = actionOpen;
      state.type = actionType;
    },
  },
});

export const { setCollectNotification } = collectNotificationSlice.actions;

export default collectNotificationSlice.reducer;
