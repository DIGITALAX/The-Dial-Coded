import { FunctionComponent } from "react";
import { DrawProps } from "../types/canvas.types";
import SideMenu from "./Options/SideMenu";
import Board from "./Board";
import BottomMenu from "./Options/BottomMenu";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "../../../../../lib/lens/constants";

const Draw: FunctionComponent<DrawProps> = ({
  setShowSideDrawOptions,
  showSideDrawOptions,
  hex,
  setHex,
  canvasRef,
  brushWidth,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  setShowBottomDrawOptions,
  showBottomDrawOptions,
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
}): JSX.Element => {
  return (
    <div 
    id="parent"
    className="relative w-full h-[70vw] grid grid-flow-col auto-cols-auto bg-offBlack rounded-lg border border-white">
      <Image
        src={`${INFURA_GATEWAY}/ipfs/QmdCN3qFCJcao9HfQVbQm3SbCjErMJysefqgP1uogXjtve`}
        objectFit="cover"
        layout="fill"
        className="absolute rounded-lg"
      />
      <SideMenu
        showSideDrawOptions={showSideDrawOptions}
        setShowSideDrawOptions={setShowSideDrawOptions}
      />
      <BottomMenu
        showBottomDrawOptions={showBottomDrawOptions}
        setShowBottomDrawOptions={setShowBottomDrawOptions}
        colorPicker={colorPicker}
        setColorPicker={setColorPicker}
        hex={hex}
        setHex={setHex}
        shapes={shapes}
        setShapes={setShapes}
        pencil={pencil}
        setPencil={setPencil}
        setShapeFillType={setShapeFillType}
        setOnDrawTracker={setOnDrawTracker}
        setThickness={setThickness}
        thickness={thickness}
        setBrushWidth={setBrushWidth}
        brushWidth={brushWidth}
      />
      <Board
        canvasRef={canvasRef}
        handleMouseDown={handleMouseDown}
        handleMouseUp={handleMouseUp}
        handleMouseMove={handleMouseMove}
      />
    </div>
  );
};
export default Draw;
