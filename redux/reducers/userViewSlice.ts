import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Profile } from "../../components/Common/types/lens.types";

export interface UserViewerState {
  value?: Profile | undefined;
}

const initialUserViewerState: UserViewerState = {
  value: undefined,
};

export const userViewerSlice = createSlice({
  name: "userViewer",
  initialState: initialUserViewerState,
  reducers: {
    setUserViewer: (
      state: UserViewerState,
      action: PayloadAction<Profile | undefined>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setUserViewer } = userViewerSlice.actions;

export default userViewerSlice.reducer;
