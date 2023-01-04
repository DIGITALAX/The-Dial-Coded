import { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { setSignIn } from "../../../../redux/reducers/signInSlice";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Draw from "./modules/Draw";
import useDraw from "./hooks/useDraw";

const CanvasSwitch: FunctionComponent = (): JSX.Element => {
  const profile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile
  );
  const isConnected = useSelector(
    (state: RootState) => state.app.walletConnectedReducer.value
  );
  const dispatch = useDispatch();
  const { openConnectModal } = useConnectModal();
  const {
    hex,
    setHex,
    showDrawOptions,
    setShowDrawOptions,
    canvasRef,
    drawing,
    brushWidth,
  } = useDraw();
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
          className="relative w-fit h-fit place-self-center font-dosis text-offBlack text-md cursor-pointer"
          onClick={
            !isConnected ? openConnectModal : () => dispatch(setSignIn(true))
          }
        >
          Please Connect to Lens to use the Canvas.
        </div>
      );

    default:
      return (
        <Draw
          hex={hex}
          setHex={setHex}
          showDrawOptions={showDrawOptions}
          setShowDrawOptions={setShowDrawOptions}
          drawing={drawing}
          canvasRef={canvasRef}
          brushWidth={brushWidth}
        />
      );
  }
};

export default CanvasSwitch;
