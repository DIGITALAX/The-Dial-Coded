export type TurnerProps = {
  handleCount: (currentSetting: number) => void;
  currentSetting: number;
  canvasURIs: string[];
};

export type UseScanResult = {
  handleCount: (currentSetting: number) => void;
  currentSetting: number;
  canvasURIs: string[];
  mainImage: string[];
  imageTitle: string[];
  imageArtist: string[];
  imageDescription: string[];
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
}