import { FunctionComponent } from "react";
import { DrawProps } from "../types/canvas.types";
import SideMenu from "./Options/SideMenu";
import Board from "./Board";
import BottomMenu from "./Options/BottomMenu";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "../../../../../lib/lens/constants";
import Publish from "./Publish";
import Base from "./Base";

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
  searchLoading,
  handleChangeSearch,
  searchTarget,
  handleKeyEnter,
  quickSearchResults,
  fillImages,
  erase,
  setErase,
  pan,
  setPan,
  handleSave,
  draftBoard,
  setDraftBoard,
}): JSX.Element => {
  return (
    <div className="relative w-full h-full grid grid-flow-row auto-rows-auto">
      <div
        id="parent"
        className={`relative w-full h-[70vw] grid grid-flow-col auto-cols-auto ${
          draftBoard ? "bg-board bg-boardSize bg-white" : "bg-spots"
        } rounded-lg border border-white row-start-1`}
      >
        <Publish />
        <SideMenu
          showSideDrawOptions={showSideDrawOptions}
          setShowSideDrawOptions={setShowSideDrawOptions}
          handleSave={handleSave}
          draftBoard={draftBoard}
          setDraftBoard={setDraftBoard}
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
          erase={erase}
          setErase={setErase}
          pan={pan}
          setPan={setPan}
        />
        <Board
          canvasRef={canvasRef}
          handleMouseDown={handleMouseDown}
          handleMouseUp={handleMouseUp}
          handleMouseMove={handleMouseMove}
        />
      </div>
      <div className="relative w-full h-72 grid grid-flow-col auto-cols-auto">
        <Base
          searchTarget={searchTarget}
          handleChangeSearch={handleChangeSearch}
          handleKeyEnter={handleKeyEnter}
          searchLoading={searchLoading}
          quickSearchResults={quickSearchResults}
          fillImages={fillImages}
        />
      </div>
    </div>
  );
};
export default Draw;
