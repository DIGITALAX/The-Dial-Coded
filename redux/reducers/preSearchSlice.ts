import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PreSearchState {
  items?: any[] | undefined;
  target: string;
  mixtapeMirrors: boolean[];
  reactionsFeed: any[];
  commented: boolean[];
  mirrored: boolean[];
  reacted: boolean[];
}

const initialPreSearchState: PreSearchState = {
  items: undefined,
  target: "",
  mixtapeMirrors: [],
  reactionsFeed: [],
  commented: [],
  mirrored: [],
  reacted: [],
};

export const preSearchSlice = createSlice({
  name: "preSearch",
  initialState: initialPreSearchState,
  reducers: {
    setPreSearch: (
      state: PreSearchState,
      {
        payload: {
          actionItems,
          actionTarget,
          actionMixtapeMirrors,
          actionReactionsFeed,
          actionCommented,
          actionMirrored,
          actionReacted,
        },
      }
    ) => {
      state.items = actionItems;
      state.target = actionTarget;
      state.mixtapeMirrors = actionMixtapeMirrors;
      state.reactionsFeed = actionReactionsFeed;
      state.commented = actionCommented;
      state.mirrored = actionMirrored;
      state.reacted = actionReacted;
    },
  },
});

export const { setPreSearch } = preSearchSlice.actions;

export default preSearchSlice.reducer;