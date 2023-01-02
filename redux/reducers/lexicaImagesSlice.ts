import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LexicaImages } from "../../components/Home/Scan/types/scan.types";

export interface LexicaImagesState {
  images?: LexicaImages[] | undefined;
}

const initialLexicaImagesState: LexicaImagesState = {
  images: [],
};

export const lexicaImagesSlice = createSlice({
  name: "lexicaImages",
  initialState: initialLexicaImagesState,
  reducers: {
    setLexicaImages: (
      state: LexicaImagesState,
      action: PayloadAction<LexicaImages[] | undefined>
    ) => {
      state.images = action.payload;
    },
  },
});

export const { setLexicaImages } = lexicaImagesSlice.actions;

export default lexicaImagesSlice.reducer;
