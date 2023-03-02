import { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { setSignIn } from "../../../../redux/reducers/signInSlice";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Draw from "./modules/Draw";
import useDraw from "./hooks/useDraw";
import useBase from "./hooks/useBase";
import useDrafts from "./hooks/useDrafts";
import usePrompt from "./hooks/usePrompt";
import usePatterns from "./hooks/usePatterns";

const CanvasSwitch: FunctionComponent = (): JSX.Element => {
  const profile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile
  );
  const isConnected = useSelector(
    (state: RootState) => state.app.walletConnectedReducer.value
  );
  const canvasType = useSelector(
    (state: RootState) => state.app.canvasTypeReducer.value
  );
  const synthElementSelect = useSelector(
    (state: RootState) => state.app.selectSynthElementReducer.value
  );
  const promptLoading = useSelector(
    (state: RootState) => state.app.synthLoadingReducer.value
  );
  const dispatch = useDispatch();
  const { openConnectModal } = useConnectModal();
  const {
    setShowPatternDrawOptions,
    showPatternDrawOptions,
    patternType,
    setPatternType,
    setTemplate,
    template,
    setSwitchType,
    switchType,
    handleMouseDownPattern,
    handleMouseMovePattern,
    handleMouseUpPattern,
    handleWheelPattern,
    canvasPatternRef,
    zoom: patternZoom,
    setZoom: setPatternZoom,
    setPan: setPatternPan,
    tool: patternTool,
    setTool: setPatternTool,
    action: patternAction,
    handlePatternClear,
    handlePatternSave,
    undo: patternUndo,
    redo: patternRedo,
    hex: patternHex,
    setHex: setPatternHex,
    colorPicker: patternColorPicker,
    setColorPicker: setPatternColorPicker,
    thickness: patternThickness,
    setThickness: setPatternThickness,
    brushWidth: patternBrushWidth,
    setBrushWidth: setPatternBrushWidth,
    writingRef: writingPatternRef,
    handleBlur: handlePatternBlur,
    selectedElement: selectedPatternElement,
    addImageToCanvas: addPatternImageToCanvas,
    handleImageAdd: handlePatternImageAdd,
    handleCanvasPatternPost,
    postLoading: patternPostLoading,
    saveImagesLocal: savePatternImagesLocal,
    setSaveImagesLocal: setSavePatternImagesLocal,
  } = usePatterns();
  const {
    steps,
    setSteps,
    cfg,
    setCfg,
    handleSendPrompt,
    prompt,
    setPrompt,
    keyExists,
    strength,
    setImg2img,
    img2img,
    setStrength,
    handleSendImg2Img,
    apiType,
    setApiType,
    localRunning,
    setNegativePrompt,
    batchSize,
    setBatchSize,
    synthProgress
  } = usePrompt();
  const {
    hex,
    setHex,
    showSideDrawOptions,
    setShowSideDrawOptions,
    brushWidth,
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    showBottomDrawOptions,
    setShowBottomDrawOptions,
    colorPicker,
    setColorPicker,
    tool,
    setShapeFillType,
    setThickness,
    thickness,
    setBrushWidth,
    handleSave,
    setDraftBoard,
    draftBoard,
    handleImageAdd,
    setTool,
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
    setNewCanvas,
    addImageToCanvas,
    handleWheel,
    canvasRef,
    setPan,
    setSaveImagesLocal,
    saveImagesLocal
  } = useDraw();
  const {
    quickSearchResults,
    searchLoading,
    handleChangeSearch,
    searchTarget,
    handleKeyEnter,
    fillImages,
  } = useBase();
  const { draftsLoading, loadDraft } = useDrafts();
  let actionValue: string = "canvas";
  const decideStringAction = () => {
    if (!profile || !isConnected) {
      actionValue = "no profile";
    }
    return actionValue;
  };

  switch (decideStringAction()) {
    case "no profile":
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
                      className={`relative w-full h-[290vw] f5:h-[220vw] fo:h-[170vw] sm:h-[120vw] md:h-[115vw] lg:h-[90vw] xl:h-[70vw] grid grid-flow-col auto-cols-auto bg-spots`}
                      onClick={
                        !isConnected
                          ? openConnectModal
                          : () => dispatch(setSignIn(true))
                      }
                    >
                      <div className="relative w-fit h-fit place-self-center text-white cursor-pointer">
                        Please Connect to Lens to use the Canvas.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
          setShapeFillType={setShapeFillType}
          setThickness={setThickness}
          thickness={thickness}
          setBrushWidth={setBrushWidth}
          handleKeyEnter={handleKeyEnter}
          handleChangeSearch={handleChangeSearch}
          searchLoading={searchLoading}
          searchTarget={searchTarget}
          quickSearchResults={quickSearchResults}
          fillImages={fillImages}
          setTool={setTool}
          handleSave={handleSave}
          draftBoard={draftBoard}
          setDraftBoard={setDraftBoard}
          handleImageAdd={handleImageAdd}
          tool={tool}
          shapes={shapes}
          setShapes={setShapes}
          undo={undo}
          redo={redo}
          selectedElement={selectedElement}
          action={action}
          writingRef={writingRef}
          handleBlur={handleBlur}
          handleClear={handleClear}
          handleCanvasPost={handleCanvasPost}
          postLoading={postLoading}
          title={title as string}
          handleTitle={handleTitle}
          handleCanvasSave={handleCanvasSave}
          saveLoading={saveLoading}
          zoom={zoom}
          setZoom={setZoom}
          addImageToCanvas={addImageToCanvas}
          draftsLoading={draftsLoading}
          loadDraft={loadDraft}
          setNewCanvas={setNewCanvas}
          setCfg={setCfg}
          cfg={cfg}
          steps={steps}
          setSteps={setSteps}
          handleSendPrompt={handleSendPrompt}
          promptLoading={promptLoading}
          prompt={prompt}
          setPrompt={setPrompt}
          keyExists={keyExists}
          setShowPatternDrawOptions={setShowPatternDrawOptions}
          showPatternDrawOptions={showPatternDrawOptions}
          setPatternType={setPatternType}
          setTemplate={setTemplate}
          patternType={patternType as string}
          template={template}
          switchType={switchType}
          setSwitchType={setSwitchType}
          handleMouseDownPattern={handleMouseDownPattern}
          handleMouseMovePattern={handleMouseMovePattern}
          handleWheel={handleWheel}
          handleWheelPattern={handleWheelPattern}
          canvasPatternRef={canvasPatternRef}
          patternZoom={patternZoom}
          setPatternZoom={setPatternZoom}
          setPan={setPan}
          strength={strength}
          setImg2img={setImg2img}
          img2img={img2img}
          setStrength={setStrength}
          handleSendImg2Img={handleSendImg2Img}
          setPatternPan={setPatternPan}
          patternTool={patternTool}
          setPatternTool={setPatternTool}
          patternAction={patternAction}
          handleMouseUpPattern={handleMouseUpPattern}
          canvasType={canvasType}
          handlePatternClear={handlePatternClear}
          handlePatternSave={handlePatternSave}
          synthElementSelect={synthElementSelect}
          patternUndo={patternUndo}
          patternRedo={patternRedo}
          patternHex={patternHex}
          setPatternHex={setPatternHex}
          patternColorPicker={patternColorPicker}
          setPatternColorPicker={setPatternColorPicker}
          patternThickness={patternThickness}
          setPatternThickness={setPatternThickness}
          patternBrushWidth={patternBrushWidth}
          setPatternBrushWidth={setPatternBrushWidth}
          writingPatternRef={writingPatternRef}
          handlePatternBlur={handlePatternBlur}
          selectedPatternElement={selectedPatternElement}
          addPatternImageToCanvas={addPatternImageToCanvas}
          handlePatternImageAdd={handlePatternImageAdd}
          apiType={apiType}
          setApiType={setApiType}
          localRunning={localRunning}
          handleCanvasPatternPost={handleCanvasPatternPost}
          patternPostLoading={patternPostLoading}
          saveImagesLocal={saveImagesLocal}
          setSaveImagesLocal={setSaveImagesLocal}
          batchSize={batchSize}
          setBatchSize={setBatchSize}
          setNegativePrompt={setNegativePrompt}
          setSavePatternImagesLocal={setSavePatternImagesLocal}
          savePatternImagesLocal={savePatternImagesLocal}
          synthProgress={synthProgress}
        />
      );
  }
};

export default CanvasSwitch;
