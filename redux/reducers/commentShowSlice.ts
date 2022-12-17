import { createSlice } from "@reduxjs/toolkit";

export interface CommentShowState {
  open: boolean;
  type?: string;
  value?: any;
}

const initialCommentShowState: CommentShowState = {
  open: false,
  type: undefined,
  value: undefined
};

export const commentShowSlice = createSlice({
  name: "commentShow",
  initialState: initialCommentShowState,
  reducers: {
    setCommentShow: (
      state: CommentShowState,
      { payload: { actionOpen, actionType, actionValue } }
    ) => {
      state.open = actionOpen;
      state.type = actionType;
      state.value = actionValue;
    },
  },
});

export const { setCommentShow } = commentShowSlice.actions;

export default commentShowSlice.reducer;
