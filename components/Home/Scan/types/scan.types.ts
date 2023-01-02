import { FormEvent } from "react";
import { Profile } from "../../../Common/types/lens.types";

export type TurnerProps = {
  handleCount: (currentSetting: number) => void;
  currentSetting: number;
  canvasURIs: string[];
  handleQuickSearch: (e: FormEvent) => Promise<void>;
  publicationSearchLength: number;
  profileSearchValues: Profile[];
  handleMoreProfileQuickSearch: () => Promise<void>;
  searchLoading: boolean;
  dropDown: boolean;
  handleChosenSearch: (type: string, user?: Profile) => void;
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
  publicationSearchLength: number;
  profileSearchValues: Profile[];
  handleMoreProfileQuickSearch: () => Promise<void>;
  searchLoading: boolean;
  handleChosenSearch: (type: string, user?: Profile) => void;
  dropDown: boolean;
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

export type PanelProps = {
  layout: string | undefined;
};
