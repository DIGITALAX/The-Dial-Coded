import { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../../redux/store";
import useParameters from "./hooks/useParameters";
import Options from "./modules/Options";
import Viewer from "./modules/Viewer";

const Parameters: FunctionComponent = (): JSX.Element => {
  const {
    feedOrder,
    feedType,
    feedPriority,
    orderPriority,
    setPriorityDrop,
    orderType,
    setTypeDrop,
    orderDrop,
    setOrderDrop,
    userTypeOpen,
    searchProfiles,
    profileSearch,
    searchLoading,
    handleChosenProfile,
    getMoreProfiles,
    searchTarget,
    setDispatcherEnabled,
    dispatcherLoading,
  } = useParameters();
  const dispatcher = useSelector(
    (state: RootState) => state.app.dispatcherReducer.value
  );
  return (
    <div className="relative w-full h-28 row-start-2 grid grid-flow-col auto-cols-auto z-20">
      <Options
        feedOrder={feedOrder}
        feedType={feedType}
        feedPriority={feedPriority}
        orderPriority={orderPriority}
        setPriorityDrop={setPriorityDrop}
        orderType={orderType}
        setTypeDrop={setTypeDrop}
        orderDrop={orderDrop}
        setOrderDrop={setOrderDrop}
      />
      <Viewer
        searchProfiles={searchProfiles}
        profileSearch={profileSearch}
        userTypeOpen={userTypeOpen}
        searchLoading={searchLoading}
        handleChosenProfile={handleChosenProfile}
        getMoreProfiles={getMoreProfiles}
        searchTarget={searchTarget}
        dispatcher={dispatcher}
        setDispatcherEnabled={setDispatcherEnabled}
        dispatcherLoading={dispatcherLoading}
      />
    </div>
  );
};

export default Parameters;
