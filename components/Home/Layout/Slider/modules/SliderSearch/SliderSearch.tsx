import { FunctionComponent } from "react";
import SearchBar from "../../../../../Common/SearchBar/SearchBar";
import { SliderSearchProps } from "./types/slidersearch.types";

const SliderSearch: FunctionComponent<SliderSearchProps> = ({
  handleChangeSearch,
  handleKeyEnter,
  searchTarget,
}): JSX.Element => {
  return (
    <div
      id="sliderSearch"
      className="relative w-full h-fit grid grid-flow-col auto-cols-auto"
    >
      <div className="relative w-full h-fit col-start-1">
        <SearchBar
          bg="grayBlue"
          borderColor="black"
          textColor="black"
          handleKeyDown={handleKeyEnter}
          handleOnChange={handleChangeSearch}
          searchTarget={searchTarget}
        />
      </div>
    </div>
  );
};

export default SliderSearch;
