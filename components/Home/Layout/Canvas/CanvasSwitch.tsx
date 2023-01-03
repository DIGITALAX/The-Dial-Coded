import { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { setSignIn } from "../../../../redux/reducers/signInSlice";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Canvas from "./Canvas";

const CanvasSwitch: FunctionComponent = (): JSX.Element => {
  const profile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile
  );
  const isConnected = useSelector(
    (state: RootState) => state.app.walletConnectedReducer.value
  );
  const dispatch = useDispatch();
  const { openConnectModal } = useConnectModal();
  let action: string = "canvas";
  const decideStringAction = () => {
    if (!profile || !isConnected) {
      action = "no profile";
    }
    return action;
  };

  switch (decideStringAction()) {
    case "no profile":
      return (
        <div
          className="relative w-fit h-fit place-self-center font-dosis text-offBlack text-base cursor-pointer"
          onClick={
            !isConnected ? openConnectModal : () => dispatch(setSignIn(true))
          }
        >
          Please Connect to Lens to use the Canvas.
        </div>
      );

    default:
      return <Canvas />;
  }
};

export default CanvasSwitch;
