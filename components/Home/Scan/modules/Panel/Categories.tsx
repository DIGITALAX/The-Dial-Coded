import { FunctionComponent } from "react";
import { CategoriesProps } from "./types/search.types";

const Categories: FunctionComponent<CategoriesProps> = ({
  categoriesList,
  handleAddtoSearch,
  searchTarget,
  dispatch,
}): JSX.Element => {
  return (
    <div className="relative w-full h-full row-start-2 fo:row-start-1 col-start-1 fo:col-start-2 grid grid-flow-col auto-cols-auto overflow-x-scroll gap-3 fo:pl-10">
      {categoriesList?.map((category: string, index: number) => {
        return (
          <span
            key={index}
            id={index <= 14 ? `record${index + 1}` : `record${index - 14}`}
            onClick={() => handleAddtoSearch(category, dispatch, searchTarget)}
            className={`relative col-start-${
              index + 1
            } w-fit h-fit px-5 font-dosis text-white rounded-2xl grid grid-flow-col py-1.5 auto-cols-auto text-sm fo:text-lg whitespace-nowrap border-2 border-offYellow cursor-pointer border-4 border-white/20`}
          >
            <div className="relative w-fit h-fit col-start-1 text-center">
              {category}
            </div>
          </span>
        );
      })}
    </div>
  );
};

export default Categories;
