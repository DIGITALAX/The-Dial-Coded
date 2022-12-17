import { FunctionComponent } from "react";
import { ParametersProps } from "../Feed/types/feed.types";
import useParameters from "./hooks/useParameters";
import Options from "./modules/Options";
import Viewer from "./modules/Viewer";

const Parameters: FunctionComponent<ParametersProps> = ({setFeedType, setSortCriteria}): JSX.Element => {
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
    userList,
    setUserTypeOpen,
    userTypeOpen,
  } = useParameters();

  return (
    <div className="relative w-full h-28 row-start-2 grid grid-flow-col auto-cols-auto z-30">
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
        setFeedType={setFeedType}
        setSortCriteria={setSortCriteria}
      />
      <Viewer
        userList={userList}
        setUserTypeOpen={setUserTypeOpen}
        userTypeOpen={userTypeOpen}
      />
    </div>
  );
};

export default Parameters;
