import { AnyAction, Dispatch } from "redux";

export type SliderSwitchProps = {
  scannerSlider: string[];
  highlightsSlider: string[];
  recordsSlider: string[];
  reachSlider: string[];
  dropsSlider: string[];
};
export type ViewerProps = {
  slider: string[];
  width: string;
  dispatch: Dispatch<AnyAction>;
};

export type UseSliderResults = {
  scannerSlider: string[];
  highlightsSlider: string[];
  recordsSlider: string[];
  reachSlider: string[];
  dropsSlider: string[];
  handleForward: (e: number) => void;
  handleBackward: (e: number) => void;
  currentValue: number;
};

export interface Viewer {
  open?: boolean;
  image?: string;
}
