import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SearchCategoriesState {
  value: string[];
}

const initialSearchCategoriesState: SearchCategoriesState = {
  value: [],
};

export const searchCategoriesSlice = createSlice({
  name: "searchCategories",
  initialState: initialSearchCategoriesState,
  reducers: {
    setSearchCategories: (state: SearchCategoriesState, action: PayloadAction<string[]>) => {
      state.value = action.payload;
    },
  },
});

export const { setSearchCategories } = searchCategoriesSlice.actions;

export default searchCategoriesSlice.reducer;
