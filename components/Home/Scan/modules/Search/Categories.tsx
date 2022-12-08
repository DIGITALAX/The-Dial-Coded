import { FunctionComponent } from "react";
import useCategories from "./hooks/useCategories";

const Categories: FunctionComponent = (): JSX.Element => {
  const { listedCategories } = useCategories();
  return (
    <div className="relative w-full h-full col-start-2 grid grid-flow-col auto-cols-auto overflow-x-scroll gap-3 pl-10">
      {listedCategories?.map((category: string, index: number) => {
        return (
          <span
            key={index}
            className={`relative col-start-${index} w-fit h-fit px-5 py-1.5 font-dosis text-white bg-black rounded-2xl grid grid-flow-col auto-cols-auto text-lg whitespace-nowrap`}
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
