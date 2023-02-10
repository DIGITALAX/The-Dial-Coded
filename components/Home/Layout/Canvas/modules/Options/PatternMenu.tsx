import Image from "next/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../../../lib/lens/constants";
import { PatternMenuProps } from "../../types/canvas.types";
import PatternOptions from "./PatternOptions";

const PatternMenu: FunctionComponent<PatternMenuProps> = ({
  setShowPatternDrawOptions,
  showPatternDrawOptions,
  setTemplate,
  patternType,
  setPatternType,
}): JSX.Element => {
  return (
    <div className="relative w-fit h-fit col-start-1 grid grid-flow-col auto-cols-auto justify-self-start self-end p-3 gap-2 row-start-1">
      <div
        className="relative w-12 h-12 rounded-md bg-black grid grid-flow-col auto-cols-auto drop-shadow-lg cursor-pointer active:scale-95 justify-self-end self-end"
        onClick={() => setShowPatternDrawOptions(!showPatternDrawOptions)}
      >
        <div className="col-start-1 relative w-fit h-fit place-self-center">
          <Image
            src={`${INFURA_GATEWAY}/ipfs/QmR5aDNEr6iBzcNv1CFkG3ypRWTesvT6fbuqGCnRf7yNcB`}
            width={30}
            height={30}
            alt="pattern"
            draggable={false}
          />
        </div>
      </div>
      {showPatternDrawOptions && (
        <PatternOptions
          patternType={patternType}
          setTemplate={setTemplate}
          setPatternType={setPatternType}
        />
      )}
    </div>
  );
};

export default PatternMenu;
