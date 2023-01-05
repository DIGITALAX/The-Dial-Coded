import { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { setSignIn } from "../../../../redux/reducers/signInSlice";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Draw from "./modules/Draw";
import useDraw from "./hooks/useDraw";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "../../../../lib/lens/constants";

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
    showSideDrawOptions,
    setShowSideDrawOptions,
    canvasRef,
    brushWidth,
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    showBottomDrawOptions,
    setShowBottomDrawOptions,
    colorPicker,
    setColorPicker,
    shapes,
    setShapes,
    pencil,
    setPencil,
    setShapeFillType,
    setOnDrawTracker,
    setThickness,
    thickness,
    setBrushWidth,
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
          className="relative w-full h-[70vw] grid grid-flow-col auto-cols-auto bg-offBlack rounded-lg border border-white grid grid-flow-col auto-cols-auto text-white font-dosis"
          onClick={
            !isConnected ? openConnectModal : () => dispatch(setSignIn(true))
          }
        >
          <Image
            src={`${INFURA_GATEWAY}/ipfs/QmdCN3qFCJcao9HfQVbQm3SbCjErMJysefqgP1uogXjtve`}
            objectFit="cover"
            layout="fill"
            className="absolute rounded-lg"
          />
          <div className="relative w-fit h-fit place-self-center">
            Please Connect to Lens to use the Canvas.
          </div>
        </div>
      );

    default:
      return (
        <Draw
          hex={hex}
          setHex={setHex}
          showSideDrawOptions={showSideDrawOptions}
          setShowSideDrawOptions={setShowSideDrawOptions}
          canvasRef={canvasRef}
          brushWidth={brushWidth}
          handleMouseDown={handleMouseDown}
          handleMouseUp={handleMouseUp}
          handleMouseMove={handleMouseMove}
          showBottomDrawOptions={showBottomDrawOptions}
          setShowBottomDrawOptions={setShowBottomDrawOptions}
          colorPicker={colorPicker}
          setColorPicker={setColorPicker}
          shapes={shapes}
          setShapes={setShapes}
          pencil={pencil}
          setPencil={setPencil}
          setShapeFillType={setShapeFillType}
          setOnDrawTracker={setOnDrawTracker}
          setThickness={setThickness}
          thickness={thickness}
          setBrushWidth={setBrushWidth}
        />
      );
  }
};

export default CanvasSwitch;
