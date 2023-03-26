import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FulfillmentState {
  open: boolean;
  image: string;
  file: string;
  catalog: string;
  sku: string;
}

const initialFulfillmentState: FulfillmentState = {
  open: false,
  image: "",
  file: "",
  catalog: "",
  sku: "",
};

export const fulfillmentSlice = createSlice({
  name: "fulfillment",
  initialState: initialFulfillmentState,
  reducers: {
    setFulfillment: (
      state: FulfillmentState,
      {
        payload: {
          actionOpen,
          actionId,
          actionFile,
          actionCatalog,
          actionSku,
        },
      }
    ) => {
      state.open = actionOpen;
      state.image = actionId;
      state.file = actionFile;
      state.catalog = actionCatalog;
      state.sku = actionSku;
    },
  },
});

export const { setFulfillment } = fulfillmentSlice.actions;

export default fulfillmentSlice.reducer;
