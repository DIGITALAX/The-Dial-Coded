import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ImagePickerModalState {
  value?: string;
}

const initialImagePickerModalState: ImagePickerModalState = {
  value: "",
};

export const imagePickerModalSlice = createSlice({
  name: "imagePickerModal",
  initialState: initialImagePickerModalState,
  reducers: {
    setImagePickerModal: (state: ImagePickerModalState, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

export const { setImagePickerModal } = imagePickerModalSlice.actions;

export default imagePickerModalSlice.reducer;
