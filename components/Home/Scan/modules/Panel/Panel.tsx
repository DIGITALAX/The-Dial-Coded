import Image from "next/image";
import { FunctionComponent } from "react";
import { useDispatch } from "react-redux";
import { setLayout } from "../../../../../redux/reducers/layoutSlice";
import Categories from "./Categories";
import useSearch from "./hooks/useSearch";
import lodash from "lodash";
import PanelOption from "../../../../Common/Panel/PanelOption";
import Arrow from "../../../../Common/Arrow/Arrow";

const Panel: FunctionComponent = (): JSX.Element => {
  const dispatch = useDispatch();
  const { open, setOpen, uris, layoutType } = useSearch();
  return (
    <div className="relative w-full h-full bg-white rounded-t-2xl row-start-3 grid grid-flow-col auto-cols-auto py-6 pl-10 z-10">
      <div className="relative w-fit h-fit col-start-1 gap-3 grid grid-flow-col auto-cols-auto self-center justify-self-start pr-2 pl-3">
        <div className="relative w-fit h-fit col-start-1 gap-6 grid grid-flow-col auto-cols-auto">
          {(!open ? lodash.slice(uris, 0, 3) : uris)?.map(
            (uri: string, index: number) => {
              return (
                <PanelOption
                  uri={uri}
                  index={index}
                  dispatch={dispatch}
                  setLayout={setLayout}
                  layoutType={layoutType}
                />
              );
            }
          )}
        </div>
        <Arrow handleValue={setOpen} value={open} />
        <div className="relative w-1 h-full col-start-3 bg-bluey/30"></div>
      </div>
      <Categories />
    </div>
  );
};

export default Panel;
