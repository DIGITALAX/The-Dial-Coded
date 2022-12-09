export type TurnerProps = {
  setCount: (currentSetting: number) => void;
  currentSetting: number;
  canvasURIs: string[];
};

export type UseScanResult = {
  setCount: (currentSetting: number) => void;
  currentSetting: number;
  canvasURIs: string[];
  mainImage: string[];
  imageTitle: string[];
  imageArtist: string[];
  imageDescription: string[];
};

export type BackgroundImageProps = {
  mainImage: string[];
  currentSetting: number;
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
