import { FormEvent } from "react";

export type UseSliderSearchResults = {
  handleChangeSearch: (e: FormEvent) => Promise<void>;
  handleKeyEnter: (e: any) => Promise<void>;
  searchLoading: boolean;
  dropDown: boolean;
  handleChosenSearch: (prompt?: string) => Promise<void>;
  publicationsSearchNotDispatch: any[];
  prompts: string[];
};

export type SliderSearchProps = {
  handleChangeSearch: (e: FormEvent) => void;
  handleKeyEnter: (e: any) => void;
  searchTarget: string;
  searchLoading: boolean;
  dropDown: boolean;
  handleChosenSearch: (prompt?: string) => Promise<void>;
  publicationsSearchNotDispatch: any[];
  prompts: string[];
};
