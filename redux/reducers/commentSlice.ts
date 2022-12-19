import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CommentState {
  value?: boolean;
}

const initialCommentState: CommentState = {
  value: false,
};

export const commentSlice = createSlice({
  name: "comment",
  initialState: initialCommentState,
  reducers: {
    setComment: (
      state: CommentState,
      action: PayloadAction<boolean>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setComment } = commentSlice.actions;

export default commentSlice.reducer;
