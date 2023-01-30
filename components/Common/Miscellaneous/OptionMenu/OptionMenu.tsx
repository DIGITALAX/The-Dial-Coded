import { FunctionComponent } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import lodash from "lodash";
import Image from "next/image";
import { OptionMenuProps } from "../../types/common.types";
import { INFURA_GATEWAY } from "../../../../lib/lens/constants";

const OptionMenu: FunctionComponent<OptionMenuProps> = ({
  col,
  image,
  handleOpenDropdown,
  openDropdown,
  bgColor,
  values,
  dispatch,
  dispatchFunction,
  selectorValue,
  imageHeight,
  imageWidth
}): JSX.Element => {
  return (
    <div
      className={`relative w-fit h-fit ${
        col && `col-start-${col}`
      } grid grid-flow-row auto-rows-auto`}
    >
      <div
        id={bgColor}
        className={`relative w-32 h-fit px-3 py-2 rounded-t-lg ${
          !openDropdown && "rounded-b-lg"
        } row-start-1 cursor-pointer grid grid-flow-col auto-cols-auto gap-3`}
        onClick={() => {
          handleOpenDropdown(!openDropdown);
        }}
      >
        <div className="relative w-fit h-fit col-start-1 place-self-center">
          <Image
            src={`${INFURA_GATEWAY}/ipfs/${image}`}
            alt={image}
            width={imageWidth}
            height={imageHeight}
            draggable={false}
          />
        </div>
        <div className="relative w-full h-fit col-start-2 text-white font-dosis lowercase self-center place-self-center grid grid-flow-col auto-cols-auto">
          <div className="relative col-start-1 place-self-center w-fit h-fit">
            {selectorValue}
          </div>
        </div>
        <div className="relative w-fit h-fit col-start-3 self-center justify-self-start">
          <IoMdArrowDropdown color="#FFDE90" size={15} />
        </div>
      </div>
      <div className="absolute row-start-2 grid grid-flow-row auto-rows-auto w-32 h-fit cursor-pointer">
        {openDropdown &&
          lodash
            .filter(values, (item) => item !== selectorValue)
            ?.map((item: string, index: number) => {
              return (
                <div
                  id={bgColor}
                  key={index}
                  className={`relative w-32 h-fit px-3 py-2 ${
                    index === values.length - 2 && "rounded-b-lg"
                  } col-start-1 grid grid-flow-col auto-cols-auto gap-3 cursor-pointer`}
                  onClick={() => {
                    handleOpenDropdown(!openDropdown);
                    openDropdown && dispatchFunction && dispatch(dispatchFunction(item));
                  }}
                >
                  <div className="relative w-fit h-fit col-start-1 text-white font-dosis lowercase place-self-center grid grid-flow-col auto-cols-auto">
                    <div className="relative col-start-1 place-self-center w-fit h-fit">
                      {openDropdown ? item : selectorValue}
                    </div>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default OptionMenu;
