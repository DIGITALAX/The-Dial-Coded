import { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../../redux/store";
import CanvasOption from "../../../../../Common/Miscellaneous/CanvasOption";
import { PatternOptionsProps } from "../../types/canvas.types";

const PatternOptions: FunctionComponent<PatternOptionsProps> = ({
  setPatternType,
  setTemplate,
  patternType,
  setSwitchType,
  switchType,
  setPatternTool,
}): JSX.Element => {
  const onPatternCanvas = useSelector(
    (state: RootState) => state.app.canvasTypeReducer.value
  );
  return (
    <div className="absolute flex flex-row gap-2 bottom-3 w-fit h-fit left-20 sm:flex-nowrap flex-wrap">
      <div className="relative w-fit h-fit grid grid-flow-row auto-rows-auto gap-1 self-end">
        {patternType === "0" && (
          <div className="relative w-fit h-fit row-start-1 place-self-center bottom-14 right-5">
            <div className="absolute w-fit h-fit grid grid-flow-col auto-cols-auto gap-1">
              {Array.from({ length: 8 }, (_, index) => index + 1).map(
                (index) => {
                  return (
                    <div
                      key={index}
                      className="relative w-fit h-fit"
                      onClick={() => (!switchType ? setSwitchType(true) : {})}
                    >
                      <CanvasOption
                        image={"0x0" + String(index)}
                        bgColor="black"
                        width={30}
                        height={20}
                        setShowString={setTemplate}
                        string_option={"0x0" + String(index)}
                        text={"RashGuard"}
                      />
                    </div>
                  );
                }
              )}
            </div>
          </div>
        )}
        <div className="relative w-fit h-fit row-start-2 self-end">
          <CanvasOption
            image="QmXuH99eUYN5SXwcCpfVaMaQh8K7sDhFp16Umax67iBdNF"
            bgColor="black"
            width={25}
            height={25}
            setShowString={setPatternType}
            string_option={"0"}
          />
        </div>
      </div>
      <div className="relative w-fit h-fit grid grid-flow-row auto-rows-auto gap-1 self-end">
        {patternType === "1" && (
          <div className="relative w-fit h-fit row-start-1 place-self-center bottom-14 right-5">
            <div className="absolute w-fit h-fit grid grid-flow-col auto-cols-auto gap-1">
              {Array.from({ length: 8 }, (_, index) => index + 1).map(
                (index) => {
                  return (
                    <div
                      key={index}
                      className="relative w-fit h-fit"
                      onClick={() => (!switchType ? setSwitchType(true) : {})}
                    >
                      <CanvasOption
                        image={"0x0" + String(index)}
                        bgColor="black"
                        width={30}
                        height={20}
                        setShowString={setTemplate}
                        string_option={"0x0" + String(index)}
                        text={"CrewNeck"}
                      />
                    </div>
                  );
                }
              )}
            </div>
          </div>
        )}
        <div className="relative w-fit h-fit row-start-2 self-end">
          <CanvasOption
            image="QmZ3aXnckWyTdCHhEDNw42qM44eZ8nQwhfuwxvEERP4imV"
            bgColor="black"
            width={25}
            height={25}
            setShowString={setPatternType}
            string_option={"1"}
          />
        </div>
      </div>

      <div className="relative w-fit h-fit grid grid-flow-row auto-rows-auto gap-1 self-end">
        {patternType === "2" && (
          <div className="relative w-fit h-fit row-start-1 place-self-center bottom-14 right-5">
            <div className="absolute w-fit h-fit grid grid-flow-col auto-cols-auto gap-1">
              {Array.from({ length: 6 }, (_, index) => index + 1).map(
                (index) => {
                  return (
                    <div
                      key={index}
                      className="relative w-fit h-fit"
                      onClick={() => (!switchType ? setSwitchType(true) : {})}
                    >
                      <CanvasOption
                        image={"0x0" + String(index)}
                        bgColor="black"
                        width={30}
                        height={20}
                        setShowString={setTemplate}
                        string_option={"0x0" + String(index)}
                        text={"Hoodie"}
                      />
                    </div>
                  );
                }
              )}
            </div>
          </div>
        )}
        <div className="relative w-fit h-fit row-start-2 self-end">
          <CanvasOption
            image="QmNgdfvo4vgpnkL3kJSjoHgyrcMo2pF5PWUDoB2FKyJmbT"
            bgColor="black"
            width={25}
            height={25}
            setShowString={setPatternType}
            string_option={"2"}
          />
        </div>
      </div>
      <div className="relative w-fit h-fit grid grid-flow-row auto-rows-auto gap-1 self-end">
        {patternType === "3" && (
          <div className="relative w-fit h-fit row-start-1 place-self-center bottom-14 right-5">
            <div className="absolute w-fit h-fit grid grid-flow-col auto-cols-auto gap-1">
              {Array.from({ length: 5 }, (_, index) => index + 1).map(
                (index) => {
                  return (
                    <div
                      key={index}
                      className="relative w-fit h-fit"
                      onClick={() => (!switchType ? setSwitchType(true) : {})}
                    >
                      <CanvasOption
                        image={"0x0" + String(index)}
                        bgColor="black"
                        width={30}
                        height={20}
                        setShowString={setTemplate}
                        string_option={"0x0" + String(index)}
                        text={"Bomber"}
                      />
                    </div>
                  );
                }
              )}
            </div>
          </div>
        )}
        <div className="relative w-fit h-fit row-start-2 self-end">
          <CanvasOption
            image="QmUJJoY3yVjXMJryZ5Gt2LR5vJy4CB1h4NvXxdMbaPkAAv"
            bgColor="black"
            width={25}
            height={25}
            setShowString={setPatternType}
            string_option={"3"}
          />
        </div>
      </div>
      <div className="relative w-fit h-fit grid grid-flow-row auto-rows-auto gap-1 self-end">
        {patternType === "4" && (
          <div className="relative w-fit h-fit row-start-1 place-self-center bottom-14 right-5">
            <div className="absolute w-fit h-fit grid grid-flow-col auto-cols-auto gap-1">
              {Array.from({ length: 6 }, (_, index) => index + 1).map(
                (index) => {
                  return (
                    <div
                      key={index}
                      className="relative w-fit h-fit"
                      onClick={() => (!switchType ? setSwitchType(true) : {})}
                    >
                      <CanvasOption
                        image={"0x0" + String(index)}
                        bgColor="black"
                        width={30}
                        height={20}
                        setShowString={setTemplate}
                        string_option={"0x0" + String(index)}
                        text={"TankTop"}
                      />
                    </div>
                  );
                }
              )}
            </div>
          </div>
        )}
        <div className="relative w-fit h-fit row-start-2 self-end">
          <CanvasOption
            image="QmdJiFdGYedEAzK2SjVGzojYhByxrqBztvUYVK3p2r2sF8"
            bgColor="black"
            width={25}
            height={25}
            setShowString={setPatternType}
            string_option={"4"}
          />
        </div>
      </div>
      <div className="relative w-fit h-fit grid grid-flow-col auto-cols-auto gap-1 self-end">
        {onPatternCanvas && (
          <CanvasOption
            image="Qme2o2azyWD6iUtroLeYBojqaLQgHq2g1p5vbGxsnZed7S"
            bgColor="black"
            width={18}
            height={25}
            setShowString={setPatternTool}
            string_option={"synth"}
          />
        )}
        <CanvasOption
          image="QmYKmPoozReHuuBLfxPB11CtQpaDuT2S3AJ54yYsdTWWwE"
          bgColor="black"
          width={18}
          height={25}
          setShowBool={setSwitchType}
          bool_option={switchType}
        />
      </div>
    </div>
  );
};

export default PatternOptions;
