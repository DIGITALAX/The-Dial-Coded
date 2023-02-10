import { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLayout } from "../../../../../redux/reducers/layoutSlice";
import Categories from "./Categories";
import usePanel from "./hooks/usePanel";
import lodash from "lodash";
import PanelOption from "../../../../Common/Panel/PanelOption";
import Arrow from "../../../../Common/Miscellaneous/Arrow/Arrow";
import { RootState } from "../../../../../redux/store";
import PanelText from "./PanelText";
import handleAddtoSearch from "../../../../../lib/lens/helpers/handleAddtoSearch";
import { useMediaQuery } from "@material-ui/core";
import { useRouter } from "next/router";

const Panel: FunctionComponent = (): JSX.Element => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { open, setOpen, uris, layoutType } = usePanel();
  const layoutState: string | undefined = useSelector(
    (state: RootState) => state.app.layoutReducer.value
  );
  const searchTarget: string = useSelector(
    (state: RootState) => state.app.searchTargetReducer.value
  );
  const categoriesList = useSelector(
    (state: RootState) => state.app.searchCategoriesReducer.value
  );
  let queryWindowSize300: boolean = useMediaQuery("(max-width:300px)");
  let queryWindowSize500: boolean = useMediaQuery("(max-width:500px)");
  return (
    <div
      className={`${
        router.asPath.includes("Post") ? "pt-2 px-2" : "px-2 pt-2 pb-2"
      } relative w-full h-full bg-shame rounded-t-2xl row-start-3 grid grid-flow-col auto-cols-auto z-10`}
    >
      <div
        className={`relative w-full h-full grid grid-flow-col auto-cols-auto rounded-t-2xl ${
          !router.asPath.includes("Post") &&
          "border-2 border-x-white/40 border-t-white/40"
        }`}
        id={!router.asPath.includes("Post") ? "conic" : "outside"}
      >
        <div className="relative w-full h-full grid grid-flow-col auto-cols-auto pl-3 md:pl-10 py-6 md:gap-0 gap-6">
          <div
            className={`relative ${
              !open && !queryWindowSize300
                ? "w-fit"
                : !queryWindowSize500
                ? "w-fit"
                : "w-full"
            } h-fit col-start-1 gap-3 flex flex-row self-center justify-self-start fo:pr-2 md:pl-3 z-1 overflow-x-scroll fo:overflow-x-clip`}
          >
            <div
              className={`relative ${
                !open ? "w-fit" : "w-full galaxy:w-80 fo:w-full"
              } h-fit col-start-1 gap-3 md:gap-6 grid grid-flow-col auto-cols-auto overflow-x-scroll`}
            >
              {(!open && !queryWindowSize300
                ? lodash.slice(uris, 0, 3)
                : uris
              )?.map((uri: string, index: number) => {
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
              })}
            </div>
            {!queryWindowSize300 && (
              <>
                <Arrow
                  handleValue={setOpen}
                  value={open}
                  up={"QmeeHhyUcz1SM8KJB2SrY7b7r9uhYFEWuMx45b2a2VgoLB"}
                  middle={"QmZSpwDjU9YYru6g44RVPaeeoLAu5YnCkXTCaNfEULzZ3i"}
                  down={"QmXfG8mpaHad7rVnbqUtGrnCsm9vkXZT3zNa8mugndUS72"}
                />
                <div className="relative w-1 h-full col-start-3 bg-bluey/30"></div>
              </>
            )}
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
            <Categories
              categoriesList={categoriesList}
              handleAddtoSearch={handleAddtoSearch}
              searchTarget={searchTarget}
              dispatch={dispatch}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Panel;
