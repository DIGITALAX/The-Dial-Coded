import { createSlice } from "@reduxjs/toolkit";
import { Profile } from "../../components/Common/types/lens.types";

export interface LensProfileState {
  profile?: Profile;
}

const initialLensProfileState: LensProfileState = {
  profile: undefined,
};

export const lensProfileSlice = createSlice({
  name: "lens profile",
  initialState: initialLensProfileState,
  reducers: {
    setLensProfile: (
      state: LensProfileState,
      { payload: { actionProfile } }
    ) => {
      state.profile = actionProfile;
    },
  },
});

export const { setLensProfile } = lensProfileSlice.actions;

export default lensProfileSlice.reducer;
