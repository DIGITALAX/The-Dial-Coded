import { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLayout } from "../../../../../redux/reducers/layoutSlice";
import Categories from "./Categories";
import useSearch from "./hooks/usePanel";
import lodash from "lodash";
import PanelOption from "../../../../Common/Panel/PanelOption";
import Arrow from "../../../../Common/Miscellaneous/Arrow/Arrow";
import { RootState } from "../../../../../redux/store";
import PanelText from "./PanelText";

const Panel: FunctionComponent = (): JSX.Element => {
  const dispatch = useDispatch();
  const { open, setOpen, uris, layoutType } = useSearch();
  const layoutState: string | undefined = useSelector(
    (state: RootState) => state.app.layoutReducer.value
  );
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
                  key={index}
                />
              );
            }
          )}
        </div>
        <Arrow
          handleValue={setOpen}
          value={open}
          up={"QmeeHhyUcz1SM8KJB2SrY7b7r9uhYFEWuMx45b2a2VgoLB"}
          middle={"QmZSpwDjU9YYru6g44RVPaeeoLAu5YnCkXTCaNfEULzZ3i"}
          down={"QmXfG8mpaHad7rVnbqUtGrnCsm9vkXZT3zNa8mugndUS72"}
        />
        <div className="relative w-1 h-full col-start-3 bg-bluey/30"></div>
      </div>
      {layoutState === "Mixtape" || layoutState === "Account" ? (
        <PanelText
          text={
            layoutState === "Mixtape"
              ? "Developer Preview	 |	 Superuser Mode for Mixtape Curation"
              : "Account Settings & Info"
          }
        />
      ) : (
        <Categories />
      )}
    </div>
  );
};

export default Panel;
