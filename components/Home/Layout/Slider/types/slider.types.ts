import { AnyAction, Dispatch } from "redux";
import { LexicaImages } from "../../../Scan/types/scan.types";

export type ViewerProps = {
  slider: LexicaImages[];
  width: string;
  dispatch: Dispatch<AnyAction>;
};

export type UseSliderResults = {
  handleForward: (e: number) => void;
  handleBackward: (e: number) => void;
  currentValue: number;
  promptString: string[];
};

export interface Viewer {
  open?: boolean;
  image?: string;
}
