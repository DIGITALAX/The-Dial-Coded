import { FunctionComponent } from "react";
import { MainProps } from "../types/feed.types";
import { MdOutlineExpandMore } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../../../redux/store";
import { setMoreFeed } from "../../../../../../../redux/reducers/moreFeedSlice";
import FeedPublication from "../../../../../../Common/FeedPublication/FeedPublication";

const Main: FunctionComponent<MainProps> = ({ images }): JSX.Element => {
  const dispatch = useDispatch();
  const isOpen = useSelector(
    (state: RootState) => state.app.moreFeedReducer.value
  );
  return (
    <div className="relative w-[50vw] h-fit col-start-1 grid grid-flow-row auto-rows-auto">
      <FeedPublication images={images} row={"1"} />
      <div
        className="relative row-start-2 p-4 w-fit h-fit place-self-center hover:opacity-70 active:scale-95 cursor-pointer"
        onClick={() => dispatch(setMoreFeed(!isOpen))}
      >
        <MdOutlineExpandMore color="black" size={25} />
      </div>
    </div>
  );
};

export default Main;
