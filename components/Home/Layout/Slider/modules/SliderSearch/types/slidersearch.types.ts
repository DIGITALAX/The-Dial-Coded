import { FormEvent } from "react";

export type UseSliderSearchResults = {
  handleChangeSearch: (e: FormEvent) => void;
  handleKeyEnter: (e: any) => void;
};

export type SliderSearchProps = {
  handleChangeSearch: (e: FormEvent) => void;
  handleKeyEnter: (e: any) => void;
  searchTarget: string;
};
