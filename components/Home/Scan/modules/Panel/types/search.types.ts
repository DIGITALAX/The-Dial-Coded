export type UsePanelResults = {
  open: boolean;
  setOpen: (e: boolean) => void;
  uris: string[];
  layoutType: string[];
};

export type UseCategoriesResults = {
  listedCategories: string[];
  backgroundColors: string[];
};

export type PanelTextProps = {
  text: string
}