import { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import handleHidePost from "../../../../lib/lens/helpers/handleHidePost";
import { RootState } from "../../../../redux/store";
import Rewind from "../../../Common/Miscellaneous/Rewind/Rewind";
import useSlider from "./hooks/useSlider";
import Presets from "./modules/Presets/Presets";
import PublicationsFound from "./modules/PublicationsFound/PublicationsFound";
import Samples from "./modules/Samples/Samples";
import useSliderSearch from "./modules/SliderSearch/hooks/useSliderSearch";
import SliderSearch from "./modules/SliderSearch/SliderSearch";
import SliderSwitch from "./SliderSwitch";

const Slider: FunctionComponent = (): JSX.Element => {
  const {
    scannerSlider,
    dropsSlider,
    highlightsSlider,
    reachSlider,
    recordsSlider,
    handleBackward,
    handleForward,
    currentValue,
  } = useSlider();
  const searchTarget = useSelector(
    (state: RootState) => state.app.searchTargetReducer.value
  );
  const dispatch = useDispatch();
  const publicationsSearch = useSelector(
    (state: RootState) => state.app.preSearchReducer
  );
  const { handleChangeSearch, handleKeyEnter } = useSliderSearch();
  return (
    <div className="relative w-full h-full row-start-2 grid grid-flow-row auto-rows-auto bg-white py-10 pl-10 gap-10">
      <SliderSearch
        handleChangeSearch={handleChangeSearch}
        handleKeyEnter={handleKeyEnter}
        searchTarget={searchTarget}
      />
      {publicationsSearch?.items && publicationsSearch?.items?.length > 0 && (
        <PublicationsFound
          publicationsSearch={publicationsSearch?.items}
          dispatch={dispatch}
          hasMirrored={publicationsSearch?.mirrored}
          hasReacted={publicationsSearch?.reacted}
          reactionsFeed={publicationsSearch?.reactionsFeed}
          hasCommented={publicationsSearch?.commented}
          mixtapeMirror={publicationsSearch?.mixtapeMirrors}
          handleHidePost={handleHidePost}
        />
      )}
      <div className="relative w-full h-full row-start-3 grid grid-flow-col auto-cols-auto gap-4">
        <div className="relative w-fit h-full col-start-1 grid grid-flow-row auto-rows-auto gap-8 col-span-1">
          <Rewind
            row={"1"}
            handleValueChange={handleForward}
            limitValue={4}
            currentValue={currentValue}
          />
          <Rewind
            row={"2"}
            scale={"-1"}
            handleValueChange={handleBackward}
            limitValue={0}
            currentValue={currentValue}
          />
        </div>
        <SliderSwitch
          scannerSlider={scannerSlider}
          dropsSlider={dropsSlider}
          reachSlider={reachSlider}
          recordsSlider={recordsSlider}
          highlightsSlider={highlightsSlider}
        />
      </div>
      <Samples />
      <Presets />
    </div>
  );
};

export default Slider;
