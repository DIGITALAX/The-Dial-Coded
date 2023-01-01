import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Profile } from "../../components/Common/types/lens.types";

export interface ChosenDMProfileState {
  profile?: Profile | undefined;
}

const initialChosenDMProfileState: ChosenDMProfileState = {
  profile: undefined,
};

export const chosenDMProfileSlice = createSlice({
  name: "chosenDMProfile",
  initialState: initialChosenDMProfileState,
  reducers: {
    setChosenDMProfile: (
      state: ChosenDMProfileState,
      action: PayloadAction<Profile | undefined>
    ) => {
      state.profile = action.payload;
    },
  },
});

export const { setChosenDMProfile } = chosenDMProfileSlice.actions;

export default chosenDMProfileSlice.reducer;
