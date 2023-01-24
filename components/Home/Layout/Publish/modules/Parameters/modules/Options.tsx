import { FunctionComponent } from "react";
import { setFeedOrder } from "../../../../../../../redux/reducers/feedOrderSlice";
import { setFeedPriority } from "../../../../../../../redux/reducers/feedPrioritySlice";
import { setFeedType } from "../../../../../../../redux/reducers/feedTypeSlice";
import { OptionsProps } from "../types/parameters.types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../../../redux/store";
import OptionMenu from "../../../../../../Common/Miscellaneous/OptionMenu/OptionMenu";

const Options: FunctionComponent<OptionsProps> = ({
  feedOrder,
  feedType,
  feedPriority,
  orderDrop,
  setOrderDrop,
  orderType,
  setTypeDrop,
  orderPriority,
  setPriorityDrop,
}): JSX.Element => {
  const dispatch = useDispatch();
  const orderSelected = useSelector(
    (state: RootState) => state.app.feedOrderReducer.value
  );
  const typeSelected = useSelector(
    (state: RootState) => state.app.feedTypeReducer.value
  );
  const prioritySelected = useSelector(
    (state: RootState) => state.app.feedPriorityReducer.value
  );
  return (
    <div className="relative w-fit h-fit row-start-1 col-start-1 flex flex-col fo:flex-row gap-5">
      <OptionMenu
        col={"1"}
        image={"QmYFZQsGchyuRFmiiPKB7KH2aQhi63Naz31kBRfFb2weFZ"}
        handleOpenDropdown={setOrderDrop}
        openDropdown={orderDrop}
        bgColor={"select1"}
        values={feedOrder}
        dispatch={dispatch}
        dispatchFunction={setFeedOrder}
        selectorValue={orderSelected}
        imageWidth={20}
        imageHeight={20}
      />
      <OptionMenu
        col={"2"}
        image={"QmUsRo1UyCBix8HHjQ9JrZTshWqS9hLL6ZcAqSn9Prdu98"}
        handleOpenDropdown={setTypeDrop}
        openDropdown={orderType}
        bgColor={"select2"}
        values={feedType}
        dispatch={dispatch}
        dispatchFunction={setFeedType}
        selectorValue={typeSelected}
        imageWidth={20}
        imageHeight={20}
      />
      <OptionMenu
        col={"3"}
        image={"QmVhUPaoLCk8Yz6TfP9p7atJMA6JfDbFB65ZxyqFEMCdyD"}
        handleOpenDropdown={setPriorityDrop}
        openDropdown={orderPriority}
        bgColor={"select3"}
        values={feedPriority}
        dispatch={dispatch}
        dispatchFunction={setFeedPriority}
        selectorValue={prioritySelected}
        imageWidth={10}
        imageHeight={10}
      />
    </div>
  );
};
export default Options;
