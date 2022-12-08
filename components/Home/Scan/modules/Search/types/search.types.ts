export type UseSearchResults = {
  open: boolean;
  setOpen: (e: boolean) => void;
  uris: string[];
  layoutType: string[];
};

export type UseCategoriesResults = {
  listedCategories: string[];
};
