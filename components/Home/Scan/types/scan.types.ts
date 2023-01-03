import { FormEvent } from "react";
import { Profile } from "../../../Common/types/lens.types";

export type TurnerProps = {
  handleCount: (currentSetting: number) => void;
  currentSetting: number;
  canvasURIs: string[];
  handleQuickSearch: (e: FormEvent) => Promise<void>;
  publicationSearchValues: any[];
  profileSearchValues: Profile[];
  handleMoreProfileQuickSearch: () => Promise<void>;
  searchLoading: boolean;
  dropDown: boolean;
  handleChosenSearch: (type: string, user?: Profile) => Promise<void>;
  handleKeyDownEnter: (e: any) => Promise<void>;
  searchTarget: string;
};

export type UseScanResult = {
  handleCount: (currentSetting: number) => void;
  currentSetting: number;
  canvasURIs: string[];
  mainImage: string[];
  imageTitle: string[];
  imageArtist: string[];
  imageDescription: string[];
  handleQuickSearch: (e: FormEvent) => Promise<void>;
  publicationSearchValues: any[];
  profileSearchValues: Profile[];
  handleMoreProfileQuickSearch: () => Promise<void>;
  searchLoading: boolean;
  handleChosenSearch: (type: string, user?: Profile) => Promise<void>;
  dropDown: boolean;
  handleKeyDownEnter: (e: any) => Promise<void>;
  scanSearchTarget: string;
};

export type BackgroundImageProps = {
  mainImage: string[];
};

export type SideTextProps = {
  imageTitle: string[];
  imageArtist: string[];
  imageDescription: string[];
  currentSetting: number;
};

export type ScanProps = {
  newLink: string;
};


export interface LexicaImages {
  id: string;
  gallery: string;
  src: string;
  srcSmall: string;
  prompt: string;
  width: number;
  height: number;
  seed: string;
  grid: boolean;
  model: string;
  guidance: number;
  promptid: string;
  nsfw: boolean;
}
