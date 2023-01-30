import Image from "next/image";
import { FormEvent, FunctionComponent } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { INFURA_GATEWAY } from "../../../lib/lens/constants";
import { SearchBarProps } from "../types/common.types";

const SearchBar: FunctionComponent<SearchBarProps> = ({
  handleKeyDown,
  handleOnChange,
  width,
  borderColor,
  bg,
  bgOpacity,
  textColor,
  searchTarget,
  searchLoading,
  height,
  textSize,
  loaderSize
}): JSX.Element => {
  return (
    <div
      className={`relative ${
        width ? `w-${width}` : "w-full"
      } h-${height} col-start-1 row-start-1 grid grid-flow-col auto-cols-auto rounded-lg border-2 border-${borderColor} opacity-90 gap-1 pl-1 ${
        bgOpacity ? `bg-${bg}/30` : `bg-bluey/50`
      }`}
    >
      <div className="relative grid grid-flow-col auto-cols-auto w-fit h-full justify-self-start self-center gap-2 col-span-1">
        <div className="relative col-start-1 w-6 h-6 place-self-center place-self-center grid grid-flow-col auto-cols-auto pl-2">
          <Image
            src={`${INFURA_GATEWAY}/ipfs/QmZhr4Eo92GHQ3Qn3xpv8HSz7ArcjgSPsD3Upe9v8H5rge`}
            alt="search"
            width={15}
            height={20}
            className={`flex w-fit h-fit relative col-start-1 place-self-center`}
            draggable={false}
          />
        </div>
        <div
          className={`relative col-start-2 w-1 h-5/6 self-center justify-self-start border border-${borderColor} rounded-lg`}
        ></div>
      </div>
      <div className="relative w-full h-full grid grid-flow-row auto-rows-auto col-start-2 col-span-12">
        <input
          className={`relative row-start-1 w-full h-full font-dosis text-${textColor} rounded-lg bg-transparent caret-transparent placeholder:text-${textColor} text-${textSize}`}
          name="search"
          placeholder="search"
          value={searchTarget}
          onChange={(e: FormEvent) => handleOnChange(e)}
          onKeyDown={(e) => handleKeyDown(e)}
          autoComplete="off"
        />
      </div>
      <div className="relative col-start-14 w-fit h-fit grid grid-flow-col auto-cols-auto justify-self-end self-center pr-3">
        {searchLoading && (
          <div className="relative w-fit h-fit animate-spin place-self-center">
            <AiOutlineLoading size={loaderSize} color={textColor} />
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
