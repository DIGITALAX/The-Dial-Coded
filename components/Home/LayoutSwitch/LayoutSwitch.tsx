import { FunctionComponent, Profiler } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import Account from "../Account/Account";
import Canvas from "../Canvas/Canvas";
import Mixtape from "../Mixtape/Mixtape";
import Post from "../Post/Post";
import Slider from "../Slider/Slider";

const LayoutSwitch: FunctionComponent = (): JSX.Element => {
  const layoutType: string | undefined = useSelector(
    (state: RootState) => state.app.layoutReducer.value
  );
  let action: string = "Post";
  const decideStringAction = () => {
    action = layoutType as string;
    return action;
  };

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
