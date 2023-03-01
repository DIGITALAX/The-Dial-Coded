import { FormEvent, FunctionComponent } from "react";
import CanvasOption from "../../../../../Common/Miscellaneous/CanvasOption";
import { SideOptionsProps } from "../../types/canvas.types";
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
  zoom,
  setZoom,
  setNewCanvas,
  patternZoom,
  setPatternZoom,
  setPan,
  setPatternPan,
  setPatternTool,
  canvasType,
  handlePatternSave,
  handlePatternClear,
  patternRedo,
  patternUndo,
  handlePatternImageAdd
}): JSX.Element => {
  return (
    <div className="relative w-fit h-fit grid grid-cols-3 f9:grid-cols-none f9:grid-flow-row auto-rows-auto gap-4">
      <div id="ai-credits">
        <CanvasOption
          image="QmPt4LreaWAN3WRzcUvo7WnVLUrCW73xKPc86vB59HowLz"
          width={25}
          height={25}
        />
      </div>
      <div className="relative w-fit h-fit grid grid-flow-row auto-rows-auto gap-2">
        <div
          className="relative w-fit h-fit"
          onClick={() =>
            canvasType
              ? setPatternZoom(patternZoom < 7 ? patternZoom + 0.1 : 7)
              : setZoom(zoom < 5 ? zoom + 0.1 : 5)
          }
        >
          <CanvasOption
            image="QmbzpjweonLJNdKqJ2Ybs6c5DwNGewYf77q3ySMbGJzfJN"
            bgColor="black"
            width={20}
            height={20}
          />
        </div>
        <div
          className="relative w-fit h-fit"
          onClick={() =>
            canvasType
              ? setPatternZoom(patternZoom > 0.2 ? patternZoom - 0.1 : 0.1)
              : setZoom(zoom > 0.2 ? zoom - 0.1 : 0.1)
          }
        >
          <CanvasOption
            bgColor="black"
            image="QmXeUfWYdWwtec82XniTA7c2dNjfVWqrUUipEg9XyM1kPn"
            width={20}
            height={6}
          />
        </div>
        <div
          className="relative w-fit h-fit"
          onClick={
            canvasType
              ? () => {
                  setPatternZoom(1);
                  setPatternPan({
                    xInitial: 0,
                    yInitial: 0,
                    xOffset: 0,
                    yOffset: 0,
                  });
                }
              : () => {
                  setZoom(1);
                  setPan({
                    xInitial: 0,
                    yInitial: 0,
                    xOffset: 0,
                    yOffset: 0,
                  });
                }
          }
        >
          <CanvasOption
            image="QmRKP7reAbEFgGrv2KmPdUe1eZgAwVmTzZoWfSLAH4gMEc"
            bgColor="black"
            width={25}
            height={28}
          />
        </div>
        <div className="relative w-fit h-fit">
          <CanvasOption
            image="QmbXieYCZWQYBzhZVt2AYB6GviyTPCP87KFUZVFKZFL4gb"
            bgColor="black"
            width={25}
            height={25}
            string_option={"pan"}
            setShowString={canvasType ? setPatternTool : setTool}
          />
        </div>
        <div className="relative w-fit h-fit" onClick={() => setNewCanvas()}>
          <CanvasOption
            image="QmP6o3oXjY3xdw7SBtVr95p7rzW7fsTy6x8C38zzirRd9Y"
            bgColor="black"
            width={39}
            height={39}
          />
        </div>
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
            onChange={
              canvasType
                ? (e: FormEvent) => handlePatternImageAdd(e, false)
                : (e: FormEvent) => handleImageAdd(e)
            }
          />
        </label>
        {!canvasType && (
          <CanvasOption
            image="QmZZhPPzhmsicoiHGKPvqATdQ3JGakrZ2G3mK67goHA9CN"
            bgColor="black"
            width={25}
            height={25}
            setShowBool={setDraftBoard}
            bool_option={draftBoard}
          />
        )}
      </div>
      <div className="relative w-fit h-fit grid grid-flow-row auto-rows-auto gap-2">
        <div
          className="relative row-start-1 w-fit h-fit"
          onClick={canvasType ? () => patternRedo() : () => redo()}
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
          onClick={canvasType ? () => patternUndo() : () => undo()}
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
        <div
          className="relative w-fit h-fit"
          onClick={
            canvasType ? () => handlePatternClear() : () => handleClear()
          }
        >
          <CanvasOption
            image="QmTXMPNsTNyEExqHeTMM3SvsowEdt4Xn2eeZ2Xe3tteLkK"
            bgColor="black"
            width={35}
            height={35}
          />
        </div>
        <div
          className="relative w-fit h-fit"
          onClick={canvasType ? () => handlePatternSave() : () => handleSave()}
        >
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
