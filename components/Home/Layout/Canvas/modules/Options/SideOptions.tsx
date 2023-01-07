import { FormEvent, FunctionComponent } from "react";
import CanvasOption from "../../../../../Common/Miscellaneous/CanvasOption";
import { SideOptionsProps } from "../../types/canvas.types";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

const SideOptions: FunctionComponent<SideOptionsProps> = ({
  handleSave,
  setDraftBoard,
  draftBoard,
  handleImageAdd,
  undo,
  redo,
  setTool,
  handleClear,
}): JSX.Element => {
  return (
    <div className="relative w-fit h-fit grid grid-flow-row auto-rows-auto gap-4">
      <div id="ai-credits">
        <CanvasOption
          image="QmPt4LreaWAN3WRzcUvo7WnVLUrCW73xKPc86vB59HowLz"
          width={25}
          height={25}
        />
      </div>
      <ReactTooltip
        anchorId="ai-credits"
        place="left"
        content="Api Credits::Coming Soon::💯"
        style={{
          fontSize: "10px",
          backgroundColor: "#131313",
          opacity: "0.7",
        }}
      />
      <div className="relative w-fit h-fit grid grid-flow-row auto-rows-auto gap-2">
        <CanvasOption
          image="QmbzpjweonLJNdKqJ2Ybs6c5DwNGewYf77q3ySMbGJzfJN"
          bgColor="black"
          width={20}
          height={20}
        />
        <CanvasOption
          bgColor="black"
          image="QmXeUfWYdWwtec82XniTA7c2dNjfVWqrUUipEg9XyM1kPn"
          width={20}
          height={6}
        />
        <CanvasOption
          image="QmRKP7reAbEFgGrv2KmPdUe1eZgAwVmTzZoWfSLAH4gMEc"
          bgColor="black"
          width={25}
          height={28}
        />
        <CanvasOption
          image="QmTi6aLhjZrFaahoqzki9TgC3idP1tXrRZQxfnXbpG5iZ9"
          bgColor="black"
          width={37}
          height={37}
          string_option={"pan"}
          setShowString={setTool}
        />
      </div>
      <div className="relative w-fit h-fit grid grid-flow-row auto-rows-auto gap-2">
        <label>
          <CanvasOption
            image="QmeBHHf7Ueca9bs4xWqNAj4UEgChPkwtpiG68xqPxaavSo"
            bgColor="black"
            width={25}
            height={25}
          />
          <input
            type="file"
            accept="image/png"
            hidden
            required
            id="files"
            multiple={false}
            name="images"
            className="caret-transparent"
            onChange={(e: FormEvent) => handleImageAdd(e)}
          />
        </label>
        <CanvasOption
          image="QmZZhPPzhmsicoiHGKPvqATdQ3JGakrZ2G3mK67goHA9CN"
          bgColor="black"
          width={25}
          height={25}
          setShowBool={setDraftBoard}
          bool_option={draftBoard}
        />
      </div>
      <div className="relative w-fit h-fit grid grid-flow-row auto-rows-auto gap-2">
        <div
          className="relative row-start-1 w-fit h-fit"
          onClick={() => redo()}
        >
          <CanvasOption
            image="QmeNcEGW5pAFjPsgLsTDPgUsEm9sy2b1F1WteotshzcKvW"
            bgColor="black"
            width={28}
            height={20}
          />
        </div>
        <div
          className="relative row-start-2 w-fit h-fit"
          onClick={() => undo()}
        >
          <CanvasOption
            image="QmZJQePuwQBP8vsa86vrPSVwsqwzam3PRbEbNxdgH7bBe9"
            bgColor="black"
            width={28}
            height={20}
          />
        </div>
      </div>
      <div className="relative w-fit h-fit grid grid-flow-row auto-rows-auto gap-2">
        <div className="relative w-fit h-fit" onClick={() => handleClear()}>
          <CanvasOption
            image="QmTXMPNsTNyEExqHeTMM3SvsowEdt4Xn2eeZ2Xe3tteLkK"
            bgColor="black"
            width={35}
            height={35}
          />
        </div>
        <div className="relative w-fit h-fit" onClick={() => handleSave()}>
          <CanvasOption
            image="QmYMJJ2U8fCWsoiaX2Twmmks8sj3z4bCU5BMNT9dXhnaBj"
            bgColor="black"
            width={25}
            height={25}
          />
        </div>
      </div>
    </div>
  );
};

export default SideOptions;
