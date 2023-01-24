import { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import Viewer from "./modules/Viewer";
import lodash from "lodash";
import { SliderSwitchProps } from "../../Scan/types/scan.types";
import { useMediaQuery } from "@material-ui/core";

const SliderSwitch: FunctionComponent<SliderSwitchProps> = ({
  imagesLoading,
  imagesScanLoading,
}): JSX.Element => {
  const dialType: string | undefined = useSelector(
    (state: RootState) => state.app.dialReducer.value
  );
  const lexicaImages = useSelector(
    (state: RootState) => state.app.lexicaImagesReducer.images
  );
  let queryWindowSize500: boolean = useMediaQuery("(max-width:500px)");
  const dispatch = useDispatch();
  let action: string = "Scanner";
  const decideStringAction = () => {
    action = dialType as string;
    return action;
  };

  switch (decideStringAction()) {
    case "Highlights":
      return (
        <Viewer
          slider={lodash.slice(lexicaImages, 0, 10)}
          width={"60"}
          dispatch={dispatch}
          imagesLoading={imagesLoading}
          imagesScanLoading={imagesScanLoading}
          col={queryWindowSize500 ? "1" : "2"}
          row={queryWindowSize500 ? "2" : "1"}
        />
      );

    case "Drops":
      return (
        <Viewer
          slider={lodash.slice(lexicaImages, 10, 20)}
          width={"96"}
          dispatch={dispatch}
          imagesLoading={imagesLoading}
          imagesScanLoading={imagesScanLoading}
          col={queryWindowSize500 ? "1" : "2"}
          row={queryWindowSize500 ? "2" : "1"}
        />
      );

    case "Reach":
      return (
        <Viewer
          slider={lodash.slice(lexicaImages, 20, 30)}
          width={"40"}
          dispatch={dispatch}
          imagesLoading={imagesLoading}
          imagesScanLoading={imagesScanLoading}
          col={queryWindowSize500 ? "1" : "2"}
          row={queryWindowSize500 ? "2" : "1"}
        />
      );

    case "Records":
      return (
        <Viewer
          slider={lodash.slice(lexicaImages, 30, 40)}
          width={"60"}
          dispatch={dispatch}
          imagesLoading={imagesLoading}
          imagesScanLoading={imagesScanLoading}
          col={queryWindowSize500 ? "1" : "2"}
          row={queryWindowSize500 ? "2" : "1"}
        />
      );

    default:
      return (
        <Viewer
          slider={lodash.slice(lexicaImages, 40, 50)}
          width={"60"}
          dispatch={dispatch}
          imagesLoading={imagesLoading}
          imagesScanLoading={imagesScanLoading}
          col={queryWindowSize500 ? "1" : "2"}
          row={queryWindowSize500 ? "2" : "1"}
        />
      );
  }
};

export default SliderSwitch;
