import { FormEvent, FunctionComponent } from "react";
import { DrawProps } from "../types/canvas.types";
import SideMenu from "./Options/SideMenu";
import BottomMenu from "./Options/BottomMenu";
import Publish from "./Options/Publish";
import Base from "./Base";
import Title from "./Title";
import Board from "./Board";
import Prompt from "./Prompt";
import PatternMenu from "./Options/PatternMenu";

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
  keyExists,
  setShowPatternDrawOptions,
  showPatternDrawOptions,
  patternType,
  setPatternType,
  setTemplate,
  setSwitchType,
  switchType,
  handleMouseDownPattern,
  handleMouseMovePattern,
  handleWheel,
  handleWheelPattern,
  canvasPatternRef,
  setPatternZoom,
  patternZoom,
  setPan,
  strength,
  setImg2img,
  img2img,
  setStrength,
  handleSendImg2Img,
  setPatternPan,
  patternTool,
  setPatternTool,
  patternAction,
  handleMouseUpPattern,
  canvasType,
  handlePatternClear,
  handlePatternSave,
  synthElementSelect,
  patternUndo,
  patternRedo,
  patternBrushWidth,
  setPatternBrushWidth,
  patternColorPicker,
  setPatternColorPicker,
  patternHex,
  setPatternHex,
  patternThickness,
  setPatternThickness,
  writingPatternRef,
  handlePatternBlur,
  selectedPatternElement,
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
                    draftBoard
                      ? `bg-board bg-boardSize bg-white`
                      : switchType
                      ? "bg-smokes bg-tileSize"
                      : "bg-spots"
                  } ${
                    canvasType && patternTool === "pencil"
                      ? "cursor-default"
                      : (!canvasType && tool === "selection") ||
                        (canvasType && patternTool === "selection")
                      ? "cursor-move"
                      : (!canvasType && tool === "text") ||
                        (canvasType && patternTool === "text")
                      ? "cursor-text"
                      : (!canvasType && tool === "erase") ||
                        (canvasType && patternTool === "erase")
                      ? "cursor-cell"
                      : (!canvasType &&
                          tool === "pan" &&
                          action !== "panning") ||
                        (patternTool === "pan" &&
                          patternAction !== "panning" &&
                          canvasType)
                      ? "cursor-grab"
                      : (tool === "pan" && action === "panning") ||
                        (patternTool === "pan" &&
                          patternAction === "panning" &&
                          canvasType)
                      ? "cursor-grabbing"
                      : (!canvasType && tool === "marquee") ||
                        canvasType ||
                        (canvasType && patternTool === "default")
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
                    setPatternZoom={setPatternZoom}
                    patternZoom={patternZoom}
                    setPan={setPan}
                    setPatternPan={setPatternPan}
                    setPatternTool={setPatternTool}
                    canvasType={canvasType}
                    handlePatternClear={handlePatternClear}
                    handlePatternSave={handlePatternSave}
                    patternUndo={patternUndo}
                    patternRedo={patternRedo}
                  />
                  <div className="absolute w-fit h-fit grid grid-flow-row auto-rows-auto z-10 bottom-14 left-4">
                    <PatternMenu
                      setShowPatternDrawOptions={setShowPatternDrawOptions}
                      showPatternDrawOptions={showPatternDrawOptions}
                      setPatternType={setPatternType}
                      setTemplate={setTemplate}
                      patternType={patternType}
                      switchType={switchType}
                      setSwitchType={setSwitchType}
                      setPatternTool={setPatternTool}
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
                      canvasType={canvasType}
                      setPatternTool={setPatternTool}
                      patternHex={patternHex}
                      setPatternHex={setPatternHex}
                      patternColorPicker={patternColorPicker}
                      setPatternColorPicker={setPatternColorPicker}
                      patternThickness={patternThickness}
                      setPatternThickness={setPatternThickness}
                      patternBrushWidth={patternBrushWidth}
                      setPatternBrushWidth={setPatternBrushWidth}
                    />
                  </div>

                  {((!canvasType && action === "writing") ||
                    (canvasType && patternAction === "writing")) && (
                    <textarea
                      ref={canvasType ? writingPatternRef : writingRef}
                      autoFocus
                      className={`w-40 h-16 p-1.5 bg-black/50 border border-white rounded-md text-white font-dosis text-sm z-10 caret-white`}
                      onKeyDown={
                        canvasType
                          ? (e: FormEvent) => handlePatternBlur(e)
                          : (e: FormEvent) => handleBlur(e)
                      }
                      style={{
                        resize: "none",
                        position: "absolute",
                        top: canvasType
                          ? selectedPatternElement?.y1
                          : selectedElement?.y1,
                        left: canvasType
                          ? selectedPatternElement?.x1
                          : selectedElement?.x1,
                      }}
                    ></textarea>
                  )}
                  <Board
                    canvasRef={canvasRef}
                    handleMouseDown={handleMouseDown}
                    handleMouseUp={handleMouseUp}
                    handleMouseMove={handleMouseMove}
                    handleMouseDownPattern={handleMouseDownPattern}
                    handleMouseMovePattern={handleMouseMovePattern}
                    handleWheel={handleWheel}
                    handleWheelPattern={handleWheelPattern}
                    canvasPatternRef={canvasPatternRef}
                    handleMouseUpPattern={handleMouseUpPattern}
                    canvasType={canvasType}
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
              keyExists={keyExists}
              strength={strength}
              setImg2img={setImg2img}
              img2img={img2img}
              setStrength={setStrength}
              handleSendImg2Img={handleSendImg2Img}
              synthElementSelect={synthElementSelect}
              canvasType={canvasType}
            />
          </div>
        </div>
      </div>
      <div className="relative w-full h-fit grid grid-flow-row auto-rows-auto">
        {/* <Drafts draftsLoading={draftsLoading} loadDraft={loadDraft} /> */}
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
