import { FunctionComponent } from "react";
import CanvasOption from "../../../../../Common/Miscellaneous/CanvasOption";
import { BottomOptionsProps } from "../../types/canvas.types";
import ColorPicker from "../ColorPicker";

const BottomOptions: FunctionComponent<BottomOptionsProps> = ({
  colorPicker,
  setColorPicker,
  hex,
  setHex,
  shapes,
  setShapes,
  pencil,
  setPencil,
  setShapeFillType,
  setOnDrawTracker,
  setThickness,
  thickness,
  setBrushWidth,
  brushWidth,
}): JSX.Element => {
  return (
    <div className="relative w-fit h-fit grid grid-flow-col auto-cols-auto gap-6">
      <div className="relative w-fit h-fit grid grid-flow-col auto-cols-auto gap-2 self-end">
        <div className="relative w-fit h-fit grid grid-flow-row auto-rows-auto gap-1 self-end">
          <div className="relative w-fit h-fit row-start-1"></div>
          <div className="relative w-fit h-fit row-start-2 self-end">
            <CanvasOption
              image="QmcWMzgeq6vGShetnRvJDy1Dt3yZ8LxDDQHLwWy5zf9YPX"
              bgColor="black"
              width={20}
              height={20}
            />
          </div>
        </div>
        <div className="relative w-fit h-fit grid grid-flow-row auto-rows-auto gap-1 self-end">
          <div className="relative w-fit h-fit row-start-1 self-end"></div>
          <div className="relative w-fit h-fit row-start-2 self-end">
            <CanvasOption
              bgColor="black"
              image="QmPvfTS6brNvnTN6e6L2Btp8eAMxC8XhErrtQEjYF1nB8o"
              width={20}
              height={20}
            />
          </div>
        </div>
      </div>
      <div className="relative w-fit h-fit grid grid-flow-col auto-cols-auto gap-2 self-end">
        <div
          className="relative w-fit h-fit grid grid-flow-row auto-rows-auto gap-1 self-end"
          onClick={() => setOnDrawTracker(true)}
        >
          <div className="relative w-fit h-fit row-start-2 self-end">
            <CanvasOption
              image="Qmf1L4mzx9yyJtZHYTQqwrdV1UX1BWjFwN6bfrxjMAuuKx"
              bgColor="black"
              width={25}
              height={20}
              setShowBool={setPencil}
              bool_option={pencil}
            />
          </div>
        </div>
        <div className="relative w-fit h-fit grid grid-flow-row auto-rows-auto gap-1 self-end">
          {thickness && (
            <div className="relative w-fit h-fit grid grid-flow-col auto-cols-auto row-start-1 bottom-6">
              <input
                type="range"
                className="absolute"
                value={brushWidth}
                onChange={(e) => setBrushWidth(Number(e.target.value))}
              />
            </div>
          )}
          <div className="relative w-fit h-fit row-start-2 self-end">
            <CanvasOption
              image="QmXsWSdgvoieTtWYFskRmZCUnTN7WHvffxd3kSZMTcBjxm"
              bgColor="black"
              width={30}
              height={40}
              setShowBool={setThickness}
              bool_option={thickness}
            />
          </div>
        </div>
        <div className="relative w-fit h-fit grid grid-flow-row auto-rows-auto gap-1 self-end">
          {shapes && (
            <div className="relative w-fit h-fit row-start-1 place-self-center bottom-14 right-5">
              <div className="absolute w-fit h-fit grid grid-flow-col auto-cols-auto gap-1">
                <div
                  className="relative w-fit h-fit col-start-1"
                  onClick={() => setOnDrawTracker(false)}
                >
                  <CanvasOption
                    image="QmRgWU2HUJJJYWNV5yfB4FCjbx1vw2K9c335xWENSduVBd"
                    bgColor="black"
                    width={30}
                    height={30}
                    setShowString={setShapeFillType}
                    string_option={["hachure", "ell"]}
                  />
                </div>
                <div
                  className="relative w-fit h-fit col-start-2"
                  onClick={() => setOnDrawTracker(false)}
                >
                  <CanvasOption
                    image="QmVcbF6SLwjn78VseukYU2q56UGnbTmCNMQpfuBUWiSLyP"
                    bgColor="black"
                    width={30}
                    height={30}
                    setShowString={setShapeFillType}
                    string_option={["solid", "ell"]}
                  />
                </div>
                <div
                  className="relative w-fit h-fit col-start-3"
                  onClick={() => setOnDrawTracker(false)}
                >
                  <CanvasOption
                    image="QmXSoMrX1zB14Q9v2H1qnCxcJKeaLz39KHtpYpNCo7yTbB"
                    bgColor="black"
                    width={30}
                    height={30}
                    setShowString={setShapeFillType}
                    string_option={["hachure", "rect"]}
                  />
                </div>
                <div
                  className="relative w-fit h-fit col-start-4"
                  onClick={() => setOnDrawTracker(false)}
                >
                  <CanvasOption
                    image="QmbLf1DV49PDDwx7nU1qLmG9yQf91Q5YYmGP7uoFbRNicQ"
                    bgColor="black"
                    width={30}
                    height={25}
                    setShowString={setShapeFillType}
                    string_option={["solid", "rect"]}
                  />
                </div>
                <div
                  className="relative w-fit h-fit col-start-5"
                  onClick={() => setOnDrawTracker(false)}
                >
                  <CanvasOption
                    image="Qmd1ToTbusW3rKLwej9m6f1LKG5amfVNhPjJvoivJciD6q"
                    bgColor="black"
                    width={35}
                    height={35}
                    setShowString={setShapeFillType}
                    string_option={["solid", "line"]}
                  />
                </div>
              </div>
            </div>
          )}
          <div className="relative w-fit h-fit row-start-2 self-end">
            <CanvasOption
              image="QmfP8bDqCTZpui8jQKcfnZPtprGJVcLgrgqf71FPSY9mK2"
              bgColor="black"
              width={25}
              height={25}
              setShowBool={setShapes}
              bool_option={shapes}
            />
          </div>
        </div>
        <div className="relative w-fit h-fit grid grid-flow-row auto-rows-auto gap-1 self-end">
          <div className="relative w-fit h-fit row-start-1"></div>
          <div className="relative w-fit h-fit row-start-2 self-end">
            <CanvasOption
              image="QmSP3FjkEoNbw4pn1nWu3vha7gAVNeNa7uPdmsXg9k48nz"
              bgColor="black"
              width={20}
              height={20}
            />
          </div>
        </div>
      </div>
      <div className="relative w-fit h-fit grid grid-flow-col auto-cols-auto gap-2 self-end">
        <div className="relative w-fit h-fit grid grid-flow-row auto-rows-auto gap-1 self-end">
          <div className="relative w-fit h-fit row-start-1"></div>
          <div className="relative w-fit h-fit row-start-2 self-end">
            <CanvasOption
              image="QmbaGF6cm1Hh89y3yV6RDUSnLEoPMEEBB3TPt5Xy2mzdYh"
              bgColor="black"
              width={25}
              height={25}
            />
          </div>
        </div>
        <div className="relative w-fit h-fit grid grid-flow-row auto-rows-auto gap-1 self-end">
          <div className="relative w-fit h-fit row-start-1"></div>
          <div className="relative w-fit h-fit row-start-2 self-end">
            <CanvasOption
              image="QmXXTr7nuQDgTGMivfxbpYYvwykNZcXMwgST7Z1U6SAV6X"
              bgColor="black"
              width={25}
              height={25}
            />
          </div>
        </div>
        <div className="relative w-fit h-fit grid grid-flow-row auto-rows-auto gap-1 self-end">
          <div className="relative w-fit h-fit row-start-1"></div>
          <div className="relative w-fit h-fit row-start-2 self-end">
            <CanvasOption
              image="QmVpTayW8DsbNkqHaug9CA4LyWTXdc9EoVmPME6BTpLoZX"
              bgColor="black"
              width={25}
              height={25}
            />
          </div>
        </div>
      </div>
      <div className="relative w-fit h-fit grid grid-flow-row auto-rows-auto gap-1 self-end">
        {colorPicker && (
          <div className="relative row-start-1 w-fit h-fit">
            <ColorPicker hex={hex} setHex={setHex} />
          </div>
        )}
        <div className="relative w-fit h-fit row-start-2 self-end">
          <CanvasOption
            image="QmQCDFSndEbNgGHWyRV5s8VFKF6xPdQxanzt5s3nRpoaxa"
            color
            width={40}
            height={40}
            setShowBool={setColorPicker}
            bool_option={colorPicker}
          />
        </div>
      </div>
    </div>
  );
};

export default BottomOptions;
