import { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import Viewer from "./modules/Viewer";
import { SliderSwitchProps } from "./types/slider.types";

const SliderSwitch: FunctionComponent<SliderSwitchProps> = ({
  scannerSlider,
  highlightsSlider,
  reachSlider,
  recordsSlider,
  dropsSlider,
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
      return <Viewer slider={highlightsSlider} width={"60"} />;

    case "Drops":
      return <Viewer slider={dropsSlider} width={"96"} />;

    case "Reach":
      return <Viewer slider={reachSlider} width={"40"} />;

    case "Records":
      return <Viewer slider={recordsSlider} width={"60"} />;

    default:
      return <Viewer slider={scannerSlider} width={"48"} />;
  }
};

export default SliderSwitch;
