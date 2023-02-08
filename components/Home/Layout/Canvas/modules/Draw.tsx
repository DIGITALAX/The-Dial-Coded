import { FormEvent, FunctionComponent } from "react";
import { DrawProps } from "../types/canvas.types";
import SideMenu from "./Options/SideMenu";
import BottomMenu from "./Options/BottomMenu";
import Publish from "./Options/Publish";
import Base from "./Base";
import Title from "./Title";
import Drafts from "./Drafts";
import Board from "./Board";
import Prompt from "./Prompt";

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
  setShapeFillType,
  setThickness,
  thickness,
  setBrushWidth,
  searchLoading,
  handleChangeSearch,
  searchTarget,
  handleKeyEnter,
  quickSearchResults,
  fillImages,
  setTool,
  handleSave,
  draftBoard,
  setDraftBoard,
  handleImageAdd,
  tool,
  shapes,
  setShapes,
  undo,
  redo,
  selectedElement,
  action,
  writingRef,
  handleBlur,
  handleClear,
  handleCanvasPost,
  postLoading,
  handleTitle,
  title,
  handleCanvasSave,
  saveLoading,
  zoom,
  setZoom,
  addImageToCanvas,
  draftsLoading,
  loadDraft,
  setNewCanvas,
  steps,
  setSteps,
  cfg,
  setCfg,
  handleSendPrompt,
  promptLoading,
  prompt,
  setPrompt,
}): JSX.Element => {
  return (
    <div className="relative w-full h-full grid grid-flow-row auto-rows-auto">
      <div className="relative w-full h-full p-px sm:p-1 md:p-4 f1:p-8 bg-moss rounded-lg sm:border-4 sm:border-black">
        <div className="relative w-full h-full p-px sm:p-2 bg-moss rounded-lg sm:border-8 sm:border-black grid grid-flow-row auto-rows-auto">
          <div className="relative w-full h-full p-px sm:p-1 md:p-4 bg-moss rounded-lg sm:border-4 sm:border-black row-start-1">
            <div
              className="relative w-full h-full p-px sm:p-1 sm:p-3 f1:p-8 f9:p-14 xl:p-20 rounded-lg sm:border-4 sm:border-black"
              id="baseDraw"
            >
              <div
                className="relative w-full h-full p-px rounded-xl"
                id="rainbow"
              >
                <div
                  id="parent"
                  className={`relative w-full h-[290vw] f5:h-[220vw] fo:h-[170vw] sm:h-[120vw] md:h-[115vw] lg:h-[90vw] xl:h-[70vw] grid grid-flow-col auto-cols-auto ${
                    draftBoard ? `bg-board bg-boardSize bg-white` : `bg-spots`
                  } ${
                    tool === "selection"
                      ? "cursor-move"
                      : tool === "text"
                      ? "cursor-text"
                      : tool === "erase"
                      ? "cursor-cell"
                      : tool === "pan" && action !== "panning"
                      ? "cursor-grab"
                      : tool === "pan" && action === "panning"
                      ? "cursor-grabbing"
                      : tool === "marquee"
                      ? "cursor-crosshair"
                      : tool === "resize" &&
                        (selectedElement?.position === "start" ||
                          selectedElement?.position === "end") &&
                        selectedElement?.type !== "text" &&
                        selectedElement?.position !== "inside"
                      ? "cursor-ew-resize"
                      : tool === "resize" &&
                        selectedElement?.type !== "text" &&
                        (selectedElement?.position === "tr" ||
                        selectedElement?.position === "bl"
                          ? "cursor-nesw-resize"
                          : (selectedElement?.position === "br" ||
                              selectedElement?.position === "tl" ||
                              selectedElement?.position === "edge") &&
                            "cursor-nwse-resize")
                  } row-start-1`}
                >
                  <Publish
                    handleCanvasPost={handleCanvasPost}
                    postLoading={postLoading}
                    handleCanvasSave={handleCanvasSave}
                    saveLoading={saveLoading}
                  />
                  <Title title={title} handleTitle={handleTitle} />
                  <SideMenu
                    showSideDrawOptions={showSideDrawOptions}
                    setShowSideDrawOptions={setShowSideDrawOptions}
                    handleSave={handleSave}
                    draftBoard={draftBoard}
                    setDraftBoard={setDraftBoard}
                    handleImageAdd={handleImageAdd}
                    undo={undo}
                    redo={redo}
                    setTool={setTool}
                    handleClear={handleClear}
                    zoom={zoom}
                    setNewCanvas={setNewCanvas}
                    setZoom={setZoom}
                  />
                  <BottomMenu
                    showBottomDrawOptions={showBottomDrawOptions}
                    setShowBottomDrawOptions={setShowBottomDrawOptions}
                    colorPicker={colorPicker}
                    setColorPicker={setColorPicker}
                    hex={hex}
                    setHex={setHex}
                    setShapeFillType={setShapeFillType}
                    setThickness={setThickness}
                    thickness={thickness}
                    setBrushWidth={setBrushWidth}
                    brushWidth={brushWidth}
                    setTool={setTool}
                    shapes={shapes}
                    setShapes={setShapes}
                  />
                  {action === "writing" && (
                    <textarea
                      ref={writingRef}
                      autoFocus
                      className={`w-40 h-16 p-1.5 bg-black/50 border border-white rounded-md text-white font-dosis text-sm z-10 caret-white`}
                      onKeyDown={(e: FormEvent) => handleBlur(e)}
                      style={{
                        resize: "none",
                        position: "absolute",
                        top: selectedElement?.y1,
                        left: selectedElement?.x1,
                      }}
                    ></textarea>
                  )}
                  <Board
                    canvasRef={canvasRef}
                    handleMouseDown={handleMouseDown}
                    handleMouseUp={handleMouseUp}
                    handleMouseMove={handleMouseMove}
                    zoom={zoom}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="relative w-full h-full row-start-2">
            <Prompt
              setCfg={setCfg}
              cfg={cfg}
              steps={steps}
              setSteps={setSteps}
              handleSendPrompt={handleSendPrompt}
              promptLoading={promptLoading}
              prompt={prompt}
              setPrompt={setPrompt}
            />
          </div>
        </div>
      </div>
      <div className="relative w-full h-fit grid grid-flow-row auto-rows-auto gap-3 p-3">
        <Drafts draftsLoading={draftsLoading} loadDraft={loadDraft} />
        <Base
          addImageToCanvas={addImageToCanvas}
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
