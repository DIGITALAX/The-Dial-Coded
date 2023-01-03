import { AnyAction, Dispatch } from "redux";

export type UsePanelResults = {
  open: boolean;
  setOpen: (e: boolean) => void;
  uris: string[];
  layoutType: string[];
};

export type PanelTextProps = {
  text: string;
};

export type CategoriesProps = {
  categoriesList: string[];
  handleAddtoSearch: (
    category: string,
    dispatch: Dispatch<AnyAction>,
    searchTarget: string
  ) => void;
  searchTarget: string;
  dispatch: Dispatch<AnyAction>;
};
