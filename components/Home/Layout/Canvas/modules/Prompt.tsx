import { FunctionComponent } from "react";
import { BsToggleOff, BsToggleOn } from "react-icons/bs";
import CassetteButton from "../../../../Common/Miscellaneous/CassetteButton/CassetteButton";
import { PromptProps } from "../types/canvas.types";

const Prompt: FunctionComponent<PromptProps> = ({
  cfg,
  setCfg,
  steps,
  setSteps,
  handleSendPrompt,
  promptLoading,
  setPrompt,
  prompt,
  keyExists,
  strength,
  setImg2img,
  img2img,
  setStrength,
  handleSendImg2Img,
  synthElementSelect,
  canvasType,
  apiType,
  setApiType,
  localRunning,
  saveImagesLocal,
  setSaveImagesLocal,
  setNegativePrompt,
  setBatchSize,
  batchSize,
  setSavePatternImagesLocal,
  savePatternImagesLocal,
  synthProgress,
}): JSX.Element => {
  return (
    <div className="relative w-full h-full flex flex-row flex-wrap f1:flex-nowrap gap-12 py-10 px-4 f5:px-12 f5:py-20">
      <div className="relative w-full f1:w-fit h-fit f1:h-full grid grid-flow-row auto-rows-auto place-self-center gap-4">
        <div className="relative w-full h-8 flex flex-row flex-nowrap items-center">
          <div className="relative w-full h-1/2 rounded-l-lg bg-black"></div>
          <div className="relative w-56 h-full rounded-xl bg-black"></div>
          <div className="relative w-full h-1/2 rounded-r-lg bg-black"></div>
        </div>
        <div className="relative w-full h-full grid grid-flow-row auto-rows-auto">
          <div className="relative w-full h-full grid grid-flow-col auto-cols-auto">
            <div
              className="relative w-fit h-fit self-center justify-self-start"
              id="guide"
            >
              {!apiType ? "Local Automatic1111" : "Replicate Online"}
            </div>
            <div
              className="relative w-fit h-fit self-center justify-self-end cursor-pointer"
              onClick={() => setApiType(!apiType)}
            >
              {!apiType ? (
                <BsToggleOff color="black" size={30} />
              ) : (
                <BsToggleOn color="#06cf0b" size={30} />
              )}
            </div>
          </div>
        </div>
        <div className="relative w-full h-full grid grid-flow-row auto-rows-auto">
          <div className="relative w-full h-full grid grid-flow-col auto-cols-auto">
            <div
              className="relative w-fit h-fit self-center justify-self-start"
              id="guide"
            >
              {(!canvasType && !saveImagesLocal) ||
              (canvasType && !savePatternImagesLocal)
                ? "Local Save"
                : "Local Save"}
            </div>
            <div
              className="relative w-fit h-fit self-center justify-self-end cursor-pointer"
              onClick={
                canvasType
                  ? () => setSavePatternImagesLocal(!savePatternImagesLocal)
                  : () => setSaveImagesLocal(!saveImagesLocal)
              }
            >
              {(!canvasType && !saveImagesLocal) ||
              (canvasType && !savePatternImagesLocal) ? (
                <BsToggleOff color="black" size={30} />
              ) : (
                <BsToggleOn color="#06cf0b" size={30} />
              )}
            </div>
          </div>
        </div>
        <div className="relative w-full h-full grid grid-flow-row auto-rows-auto">
          <div className="relative w-full h-full grid grid-flow-col auto-cols-auto">
            <div
              className="relative w-fit h-fit self-center justify-self-start"
              id="guide"
            >
              {!img2img ? "Txt2Img" : "Img2Img"}
            </div>
            <div
              className="relative w-fit h-fit self-center justify-self-end cursor-pointer"
              onClick={() => setImg2img(!img2img)}
            >
              {!img2img ? (
                <BsToggleOff color="black" size={30} />
              ) : (
                <BsToggleOn color="#06cf0b" size={30} />
              )}
            </div>
          </div>
        </div>
        <div className="relative w-full h-full grid grid-flow-row auto-rows-auto">
          <div className="relative w-full h-full grid grid-flow-col auto-cols-auto">
            <div
              className="relative w-fit h-fit self-center justify-self-start"
              id="guide"
            >
              Batch Size:
            </div>
            <div className="relative w-fit h-fit self-center justify-self-end">
              <CassetteButton
                right="0"
                bottom="0"
                position="relative"
                text={batchSize}
                textSize="xs"
              />
            </div>
          </div>
          <div className="relative w-full h-full">
            <input
              type={"range"}
              id="promptRange"
              step={"1"}
              max={10}
              min={1}
              defaultValue={batchSize}
              className="w-full"
              onChange={(e) => setBatchSize(e.target.value)}
            />
          </div>
        </div>
        <div className="relative w-full h-full grid grid-flow-row auto-rows-auto">
          <div className="relative w-full h-full grid grid-flow-col auto-cols-auto">
            <div
              className="relative w-fit h-fit self-center justify-self-start"
              id="guide"
            >
              Steps:
            </div>
            <div className="relative w-fit h-fit self-center justify-self-end">
              <CassetteButton
                right="0"
                bottom="0"
                position="relative"
                text={steps}
                textSize="xs"
              />
            </div>
          </div>
          <div className="relative w-full h-full">
            <input
              name="steps"
              type={"range"}
              step={"0.5"}
              min={1}
              id="promptRange"
              defaultValue={steps}
              className="w-full"
              onChange={(e) => setSteps(e.target.value)}
            />
          </div>
        </div>
        <div className="relative w-full h-full grid grid-flow-row auto-rows-auto">
          <div className="relative w-full h-full grid grid-flow-col auto-cols-auto">
            <div
              className="relative w-fit h-fit self-center justify-self-start"
              id="guide"
            >
              CFG:
            </div>
            <div className="relative w-fit h-fit self-center justify-self-end">
              <CassetteButton
                right="0"
                bottom="0"
                position="relative"
                text={cfg}
                textSize="xs"
              />
            </div>
          </div>
          <div className="relative w-full h-full">
            <input
              type={"range"}
              id="promptRange"
              step={"0.5"}
              min={1}
              defaultValue={cfg}
              className="w-full"
              onChange={(e) => setCfg(e.target.value)}
            />
          </div>
        </div>
        {img2img && (
          <div className="relative w-full h-full grid grid-flow-row auto-rows-auto">
            <div className="relative w-full h-full grid grid-flow-col auto-cols-auto">
              <div
                className="relative w-fit h-fit self-center justify-self-start"
                id="guide"
              >
                Strength:
              </div>
              <div className="relative w-fit h-fit self-center justify-self-end">
                <CassetteButton
                  right="0"
                  bottom="0"
                  position="relative"
                  text={strength}
                  textSize="xs"
                />
              </div>
            </div>
            <div className="relative w-full h-full">
              <input
                type={"range"}
                id="promptRange"
                step={"0.5"}
                defaultValue={strength}
                className="w-full"
                onChange={(e) => setStrength(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>
      <div className="relative w-full h-full flex flex-col gap-6">
        <div className="relative w-full h-44 f5:h-36 flex border-b-4 border-x-2 border-black rounded-md bg-weed place-self-center">
          <div className="relative w-full h-full p-px rounded-sm" id="mass">
            <textarea
              onChange={(e) => setPrompt(e.target.value)}
              id="mass"
              className="relative w-full h-full bg-weed rounded-xl p-1 text-litnus font-sats text-base caret-white"
              style={{ resize: "none" }}
              placeholder={
                apiType
                  ? !keyExists
                    ? "The  DIAL operates a HUMAN IN THE LOOP + AI paradigm. You must complete the circuit to activate STABLE DIFFUSION."
                    : !img2img
                    ? "Craft prompts for what you want to create here, with words first. Add modifiers for more spectacular results…"
                    : "Use the Marquee Tool to Select the Canvas Area to Use as an Init for Img2Img Synth"
                  : !localRunning
                  ? "The  DIAL operates a HUMAN IN THE LOOP + AI paradigm. You must complete the circuit to activate STABLE DIFFUSION."
                  : !img2img
                  ? "Craft prompts for what you want to create here, with words first. Add modifiers for more spectacular results…"
                  : "Use the Marquee Tool to Select the Canvas Area to Use as an Init for Img2Img Synth"
              }
              disabled={
                promptLoading ||
                (!keyExists && apiType) ||
                (!localRunning && !apiType)
                  ? true
                  : false
              }
            ></textarea>
            <div className="absolute w-fit h-fit bottom-2 right-2 z-1">
              <CassetteButton
                text={
                  apiType
                    ? keyExists
                      ? !canvasType
                        ? "synth"
                        : synthElementSelect
                        ? "synth"
                        : "select template"
                      : "add key"
                    : localRunning
                    ? "synth"
                    : "activate local"
                }
                textSize="sm"
                right="2"
                bottom="2"
                position="absolute"
                handleSend={img2img ? handleSendImg2Img : handleSendPrompt}
                loading={promptLoading}
                value={prompt as string}
                keyExists={keyExists}
                canvasType={canvasType}
                synthElement={synthElementSelect ? true : false}
                localRunning={localRunning}
                apiType={apiType}
              />
            </div>
          </div>
        </div>
        {!apiType && (
          <div className="relative w-full h-44 f5:h-36 flex border-b-4 border-x-2 border-black rounded-md bg-weed place-self-center">
            <div className="relative w-full h-full p-px rounded-sm" id="mass">
              <textarea
                onChange={(e) => setNegativePrompt(e.target.value)}
                id="mass"
                className="relative w-full h-full bg-weed rounded-xl p-1 text-litnus font-sats text-base caret-white"
                style={{ resize: "none" }}
                placeholder={
                  "Negative Prompt"
                }
                disabled={
                  promptLoading ||
                  (!keyExists && apiType) ||
                  (!localRunning && !apiType)
                    ? true
                    : false
                }
              ></textarea>
            </div>
          </div>
        )}
        {!apiType && (
          <div className="relative h-4 w-full flex border border-black">
            <div
              className="relative h-full bg-litnus"
              style={{
                width:
                  synthProgress.toFixed(1) < "0.9"
                    ? synthProgress * 100 + "%"
                    : "100%",
              }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Prompt;
