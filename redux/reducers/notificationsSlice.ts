import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface NotificationsState {
  value: boolean;
}

const initialNotificationsState: NotificationsState = {
  value: false,
};

export const notificationsSlice = createSlice({
  name: "notifications",
  initialState: initialNotificationsState,
  reducers: {
    setNotifications: (
      state: NotificationsState,
      action: PayloadAction<boolean>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setNotifications } = notificationsSlice.actions;

export default notificationsSlice.reducer;
