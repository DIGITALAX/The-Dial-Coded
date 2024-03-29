import { FunctionComponent } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import lodash, { isString } from "lodash";
import { CollectButtonProps } from "../../types/common.types";
import { Erc20 } from "../../types/lens.types";

const CollectButton: FunctionComponent<CollectButtonProps> = ({
  values,
  col,
  row,
  openDropdown,
  handleOpenDropdown,
  selectValue,
  selectFunction,
  label,
  mixtape,
}): JSX.Element => {
  let newValues: string[] = [];
  if (values) {
    if (isString(values[0])) {
      newValues = values as string[];
    } else {
      newValues = values.flatMap((value) => (value as Erc20)?.symbol);
    }
  } else {
    newValues = ["yes", "no"];
  }

  return (
    <div
      className={`relative w-fit h-fit ${col && `col-start-${col}`} ${
        row && `row-start-${row}`
      } grid grid-flow-row auto-rows-auto grid grid-flow-row auto-rows-auto ${
        !mixtape ? "pb-3 pr-3 gap-3" : "gap-1 z-10"
      }`}
    >
      <div className="relative w-fit h-fit row-start-1 font-dosis text-black text-sm whitespace-pre-wrap break-word sm:whitespace-nowrap justify-self-start self-center text-left">
        {label}
      </div>
      <div
        className={`relative w-40 px-3 rounded-t-lg ${
          mixtape ? "bg-white border border-lB h-8" : "bg-offBlue h-10 py-2"
        } ${
          !openDropdown && "rounded-b-lg"
        } row-start-2 cursor-pointer grid grid-flow-col auto-cols-auto gap-3`}
        onClick={() => {
          handleOpenDropdown(!openDropdown);
        }}
      >
        <div
          className={`relative w-full h-fit col-start-2 ${
            mixtape ? "text-offBlack" : "text-white"
          } font-dosis lowercase self-center place-self-center grid grid-flow-col auto-cols-auto`}
        >
          <div className="relative col-start-1 place-self-center w-fit h-fit whitespace-nowrap">
            {selectValue}
          </div>
        </div>
        <div
          className={`relative w-fit h-fit col-start-3 self-center ${
            mixtape ? "justify-self-end" : "justify-self-start"
          }`}
        >
          <IoMdArrowDropdown
            color={mixtape ? "#81A8F8" : "#FFDE90"}
            size={15}
          />
        </div>
      </div>
      <div className="absolute row-start-3 grid grid-flow-row auto-rows-auto w-32 h-fit cursor-pointer">
        {openDropdown &&
          lodash
            .filter(newValues, (item) => item !== selectValue)
            ?.map((item: string, index: number) => {
              return (
                <div
                  key={index}
                  className={`relative w-40 h-10 px-3 py-2 ${
                    index === newValues?.length - 2 && "rounded-b-lg"
                  } ${newValues} col-start-1 ${
                    mixtape ? "bg-white" : "bg-offBlue"
                  } grid grid-flow-col auto-cols-auto gap-3 cursor-pointer hover:bg-black/70 justify-self-center`}
                  onClick={() => {
                    handleOpenDropdown(!openDropdown);
                    openDropdown && selectFunction(item);
                  }}
                >
                  <div
                    className={`relative w-fit h-fit col-start-1 ${
                      mixtape ? "text-offBlack" : "text-white"
                    } font-dosis lowercase place-self-center grid grid-flow-col auto-cols-auto`}
                  >
                    <div className="relative col-start-1 place-self-center w-fit h-fit">
                      {openDropdown ? item : selectValue}
                    </div>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default CollectButton;
