import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PreSearchState {
  items?: any;
  target: string;
}

const initialPreSearchState: PreSearchState = {
  items: undefined,
  target: "",
};

export const preSearchSlice = createSlice({
  name: "preSearch",
  initialState: initialPreSearchState,
  reducers: {
    setPreSearch: (
      state: PreSearchState,
      { payload: { actionItems, actionTarget } }
    ) => {
      state.items = actionItems;
      state.target = actionTarget;
    },
  },
});

export const { setPreSearch } = preSearchSlice.actions;

export default preSearchSlice.reducer;
