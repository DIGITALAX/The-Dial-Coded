import { FunctionComponent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setChosenDMProfile } from "../../../redux/reducers/chosenDMProfileSlice";
import { setSearchTarget } from "../../../redux/reducers/searchTargetSlice";
import { RootState } from "../../../redux/store";
import Account from "../Layout/Account/Account";
import Canvas from "../Layout/Canvas/Canvas";
import Mixtape from "../Layout/Mixtape/Mixtape";
import Post from "../Layout/Publish/Post";
import Slider from "../Layout/Slider/Slider";

const LayoutSwitch: FunctionComponent = (): JSX.Element => {
  const layoutType: string | undefined = useSelector(
    (state: RootState) => state.app.layoutReducer.value
  );
  const dispatch = useDispatch();
  let action: string = "Post";
  const decideStringAction = () => {
    if (action.includes("?=")) {
      action = layoutType?.split("/#")[1] as string;
    } else {
      action = layoutType as string;
    }
    return action;
  };

  useEffect(() => {
    if (action !== "Account") {
      dispatch(setSearchTarget(""));
      dispatch(setChosenDMProfile(undefined));
    }
  }, [action]);

  switch (decideStringAction()) {
    case "Canvas":
      return <Canvas />;

    case "Account":
      return <Account />;

    case "Slider":
      return <Slider />;

    case "Mixtape":
      return <Mixtape />;

    default:
      return <Post />;
  }
};

export default LayoutSwitch;
