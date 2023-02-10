import { FunctionComponent } from "react";
import CanvasOption from "../../../../../Common/Miscellaneous/CanvasOption";
import { PatternOptionsProps } from "../../types/canvas.types";

const PatternOptions: FunctionComponent<PatternOptionsProps> = ({
  setPatternType,
  setTemplate,
  patternType,
}): JSX.Element => {
  return (
    <div className="absolute flex flex-row gap-2 bottom-3 w-fit h-fit left-20">
      <div className="relative w-fit h-fit grid grid-flow-row auto-rows-auto gap-1 self-end">
        {patternType === "rash" && (
          <div className="relative w-fit h-fit row-start-1 place-self-center bottom-14 right-5">
            <div className="absolute w-fit h-fit grid grid-flow-col auto-cols-auto gap-1">
              <CanvasOption
                image="0x01"
                bgColor="black"
                width={30}
                height={20}
                setShowString={setTemplate}
                string_option={"0x01"}
                text
              />
              <CanvasOption
                image="0x02"
                bgColor="black"
                width={30}
                height={20}
                setShowString={setTemplate}
                string_option={"0x02"}
                text
              />
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
            string_option={"rash"}
          />
        </div>
      </div>
      <div className="relative w-fit h-fit grid grid-flow-row auto-rows-auto gap-1 self-end">
        <CanvasOption
          image="QmZ3aXnckWyTdCHhEDNw42qM44eZ8nQwhfuwxvEERP4imV"
          bgColor="black"
          width={25}
          height={25}
          setShowString={setPatternType}
          string_option={"shirt"}
        />
      </div>

      <div className="relative w-fit h-fit grid grid-flow-row auto-rows-auto gap-1 self-end">
        <CanvasOption
          image="QmNgdfvo4vgpnkL3kJSjoHgyrcMo2pF5PWUDoB2FKyJmbT"
          bgColor="black"
          width={25}
          height={25}
          setShowString={setPatternType}
          string_option={"hoodie"}
        />
      </div>

      <div className="relative w-fit h-fit grid grid-flow-row auto-rows-auto gap-1 self-end">
        <CanvasOption
          image="QmUJJoY3yVjXMJryZ5Gt2LR5vJy4CB1h4NvXxdMbaPkAAv"
          bgColor="black"
          width={25}
          height={25}
          setShowString={setPatternType}
          string_option={"jacket"}
        />
      </div>

      <div className="relative w-fit h-fit grid grid-flow-row auto-rows-auto gap-1 self-end">
        <CanvasOption
          image="QmdJiFdGYedEAzK2SjVGzojYhByxrqBztvUYVK3p2r2sF8"
          bgColor="black"
          width={25}
          height={25}
          setShowString={setPatternType}
          string_option={"tank"}
        />
      </div>
    </div>
  );
};

export default PatternOptions;
