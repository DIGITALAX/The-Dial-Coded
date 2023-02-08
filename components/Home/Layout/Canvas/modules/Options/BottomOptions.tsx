import { FunctionComponent } from "react";
import CanvasOption from "../../../../../Common/Miscellaneous/CanvasOption";
import { BottomOptionsProps } from "../../types/canvas.types";
import ColorPicker from "./ColorPicker";

const BottomOptions: FunctionComponent<BottomOptionsProps> = ({
  colorPicker,
  setColorPicker,
  hex,
  setHex,
  shapes,
  setShapes,
  setShapeFillType,
  setThickness,
  thickness,
  setBrushWidth,
  brushWidth,
  setTool,
}): JSX.Element => {
  return (
    <div className="absolute w-fit h-fit flex flex-row f9:flex-nowrap flex-wrap gap-6 left-20 bottom-3 f9:bottom-auto f9:top-2">
      <div className="relative w-fit h-fit grid f5:grid-flow-col auto-cols-auto gap-2 self-end f5:grid-cols-none grid-cols-2 f5:right-auto right-16">
        <div className="relative w-fit h-fit grid grid-flow-row auto-rows-auto gap-1 self-end">
          <div className="relative w-fit h-fit row-start-2 self-end">
            <CanvasOption
              image="QmcWMzgeq6vGShetnRvJDy1Dt3yZ8LxDDQHLwWy5zf9YPX"
              bgColor="black"
              width={20}
              height={20}
              setShowString={setTool}
              string_option={"default"}
            />
          </div>
        </div>
        <div className="relative w-fit h-fit grid grid-flow-row auto-rows-auto gap-1 self-end">
          <div className="relative w-fit h-fit row-start-2 self-end">
            <CanvasOption
              bgColor="black"
              image="QmPvfTS6brNvnTN6e6L2Btp8eAMxC8XhErrtQEjYF1nB8o"
              width={20}
              height={20}
              setShowString={setTool}
              string_option={"selection"}
            />
          </div>
        </div>
        <div className="relative w-fit h-fit grid grid-flow-row auto-rows-auto gap-1 self-end">
          <div className="relative w-fit h-fit row-start-2 self-end">
            <CanvasOption
              bgColor="black"
              image="QmPVmyozQu3DwX2f5dQnv6MgRtmDckrnKNje2A4ettN9qS"
              width={40}
              height={40}
              setShowString={setTool}
              string_option={"resize"}
            />
          </div>
        </div>
      </div>
      <div className="relative w-fit h-fit grid f5:grid-flow-col auto-cols-auto gap-2 f5:grid-cols-none grid-cols-2 self-end f5:right-auto right-16">
        <div className="relative w-fit h-fit grid grid-flow-row auto-rows-auto gap-1 self-end">
          <div className="relative w-fit h-fit row-start-2 self-end">
            <CanvasOption
              image="Qmf1L4mzx9yyJtZHYTQqwrdV1UX1BWjFwN6bfrxjMAuuKx"
              bgColor="black"
              width={25}
              height={20}
              setShowString={setTool}
              string_option={"pencil"}
            />
          </div>
        </div>
        <div className="relative w-fit h-fit grid grid-flow-row auto-rows-auto gap-1 self-end">
          {thickness && (
            <div className="relative w-fit h-fit grid grid-flow-col auto-cols-auto row-start-1 bottom-6">
              <input
                type="range"
                className="f11:right-10 right-auto f5:right-auto absolute w-[7rem] galaxy:w-[9rem] fo:w-[7rem] sm:w-[10rem] md:w-[15rem]"
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
                  onClick={() => {
                    setTool("ell");
                  }}
                >
                  <CanvasOption
                    image="QmRgWU2HUJJJYWNV5yfB4FCjbx1vw2K9c335xWENSduVBd"
                    bgColor="black"
                    width={30}
                    height={30}
                    setShowString={setShapeFillType}
                    string_option={"hachure"}
                  />
                </div>
                <div
                  className="relative w-fit h-fit col-start-2"
                  onClick={() => {
                    setTool("ell");
                  }}
                >
                  <CanvasOption
                    image="QmVcbF6SLwjn78VseukYU2q56UGnbTmCNMQpfuBUWiSLyP"
                    bgColor="black"
                    width={30}
                    height={30}
                    setShowString={setShapeFillType}
                    string_option={"solid"}
                  />
                </div>
                <div
                  className="relative w-fit h-fit col-start-3"
                  onClick={() => {
                    setTool("rect");
                  }}
                >
                  <CanvasOption
                    image="QmXSoMrX1zB14Q9v2H1qnCxcJKeaLz39KHtpYpNCo7yTbB"
                    bgColor="black"
                    width={30}
                    height={30}
                    setShowString={setShapeFillType}
                    string_option={"hachure"}
                  />
                </div>
                <div
                  className="relative w-fit h-fit col-start-4"
                  onClick={() => {
                    setTool("rect");
                  }}
                >
                  <CanvasOption
                    image="QmbLf1DV49PDDwx7nU1qLmG9yQf91Q5YYmGP7uoFbRNicQ"
                    bgColor="black"
                    width={30}
                    height={25}
                    setShowString={setShapeFillType}
                    string_option={"solid"}
                  />
                </div>
                <div
                  className="relative w-fit h-fit col-start-5"
                  onClick={() => {
                    setTool("line");
                  }}
                >
                  <CanvasOption
                    image="Qmd1ToTbusW3rKLwej9m6f1LKG5amfVNhPjJvoivJciD6q"
                    bgColor="black"
                    width={35}
                    height={35}
                    setShowString={setShapeFillType}
                    string_option={"solid"}
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
          <div className="relative w-fit h-fit row-start-2 self-end">
            <CanvasOption
              image="QmcsGqcvZv4jXFeN9Eg9b1aDMF5asQbLB2bKLB88PzBLna"
              bgColor="black"
              width={30}
              height={30}
              setShowString={setTool}
              string_option={"text"}
            />
          </div>
        </div>
      </div>
      <div className="relative w-fit h-fit grid grid-flow-col auto-cols-auto gap-2 self-end f5:right-auto right-16">
        <div className="relative w-fit h-fit grid grid-flow-row auto-rows-auto gap-1 self-end">
          <div className="relative w-fit h-fit row-start-2 self-end">
            <CanvasOption
              image="QmSfhjtPDNBq4FZZMkFNRna8e9gwL1fEU7oxdyysGGVhnU"
              bgColor="black"
              width={35}
              height={35}
              setShowString={setTool}
              string_option={"erase"}
            />
          </div>
        </div>
        <div className="relative w-fit h-fit grid grid-flow-row auto-rows-auto gap-1 self-end">
          <div className="relative w-fit h-fit row-start-2 self-end">
            <CanvasOption
              image="QmXXTr7nuQDgTGMivfxbpYYvwykNZcXMwgST7Z1U6SAV6X"
              bgColor="black"
              width={25}
              height={25}
              setShowString={setTool}
              string_option={"marquee"}
            />
          </div>
        </div>
        {/* <div className="relative w-fit h-fit grid grid-flow-row auto-rows-auto gap-1 self-end">
          <div className="relative w-fit h-fit row-start-1"></div>
          <div className="relative w-fit h-fit row-start-2 self-end">
            <CanvasOption
              image="QmVpTayW8DsbNkqHaug9CA4LyWTXdc9EoVmPME6BTpLoZX"
              bgColor="black"
              width={25}
              height={25}
            />
          </div>
        </div> */}
      </div>
      <div className="relative w-fit h-fit grid grid-flow-row auto-rows-auto gap-1 self-end">
        {colorPicker && (
          <div className="absolute bottom-20 row-start-1 w-fit h-fit">
            <ColorPicker hex={hex} setHex={setHex} />
          </div>
        )}
        <div className="relative w-fit h-fit row-start-2 self-end">
          <CanvasOption
            image="Qmd3CpLhtiUhYkWw12DDmWf8M5mRMs3jZdz9JhhX7m1NLW"
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
