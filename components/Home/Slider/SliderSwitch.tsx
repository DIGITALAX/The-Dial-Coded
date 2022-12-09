import { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { SliderSwitchProps } from "./types/slider.types";
import ScannerViewer from "./modules/ScannerViewer";
import HighlightsViewer from "./modules/HighlightsViewer";
import DropsViewer from "./modules/DropsViewer";
import ReachViewer from "./modules/ReachViewer";
import RecordsViewer from "./modules/RecordsViewer";

const SliderSwitch: FunctionComponent<SliderSwitchProps> = ({
  scannerSlider,
  highlightsSlider,
  reachSlider,
  recordsSlider,
  dropsSlider
}): JSX.Element => {
  const dialType: string | undefined = useSelector(
    (state: RootState) => state.app.dialReducer.value
  );
  let action: string = "Scanner";
  const decideStringAction = () => {
    action = dialType as string;
    return action;
  };

  switch (decideStringAction()) {
    case "Highlights":
      return <HighlightsViewer highlightsSlider={highlightsSlider} />;

    case "Drops":
      return <DropsViewer dropsSlider={dropsSlider} />;

    case "Reach":
      return <ReachViewer reachSlider={reachSlider} />;

    case "Records":
      return <RecordsViewer recordsSlider={recordsSlider} />;

    default:
      return <ScannerViewer scannerSlider={scannerSlider} />;
  }
};

export default SliderSwitch;
