import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserViewerState {
  value: string;
}

const initialUserViewerState: UserViewerState = {
  value: "Select User",
};

export const userViewerSlice = createSlice({
  name: "userViewer",
  initialState: initialUserViewerState,
  reducers: {
    setUserViewer: (state: UserViewerState, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

export const { setUserViewer } = userViewerSlice.actions;

export default userViewerSlice.reducer;
