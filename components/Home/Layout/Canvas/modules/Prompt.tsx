import { FunctionComponent } from "react";
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
  prompt
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
              id="promptRange"
              defaultValue={60}
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
              defaultValue={10}
              className="w-full"
              onChange={(e) => setCfg(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="relative w-full h-36 grid grid-flow-col auto-cols-auto border-b-4 border-x-2 border-black rounded-md bg-weed place-self-center">
        <div className="relative w-full h-full p-px" id="mass">
          <textarea
            onChange={(e) => setPrompt(e.target.value)}
            id="mass"
            className="relative w-full h-full bg-weed rounded-lg p-1 text-litnus font-sats text-base"
            style={{ resize: "none" }}
            placeholder="Craft prompts for what you want to create here, with words first. 
            Add modifiers for more spectacular results…"
            disabled={promptLoading ? true : false}
          ></textarea>
          <div className="absolute w-fit h-fit bottom-2 right-2 z-1">
            <CassetteButton
              text="synth"
              textSize="sm"
              right="2"
              bottom="2"
              position="absolute"
              handleSend={handleSendPrompt}
              loading={promptLoading}
              value={prompt as string}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prompt;
