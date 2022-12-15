import { FunctionComponent } from "react";
import { MainProps } from "../types/feed.types";
import { MdOutlineExpandMore, MdOutlineExpandLess } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../../../redux/store";
import { setMoreFeed } from "../../../../../../../redux/reducers/moreFeedSlice";
import FeedPublication from "../../../../../../Common/Feed/FeedPublication";
import { Post } from "../../../../../../Common/types/lens.types";

const Main: FunctionComponent<MainProps> = ({
  publicationsFeed,
}): JSX.Element => {
  const dispatch = useDispatch();
  const isOpen = useSelector(
    (state: RootState) => state.app.moreFeedReducer.value
  );
  return (
    <div className="relative w-[50vw] h-fit col-start-1 grid grid-flow-row auto-rows-auto gap-5">
      <div className={`relative row-start-1 w-full h-[80rem] overflow-y-scroll grid grid-flow-row auto-rows-auto gap-3`}>
        {publicationsFeed?.map((publication: Post, index: number) => {
          return <FeedPublication dispatch={dispatch} publication={publication} key={index} />;
        })}
      </div>
      <div
        className="relative row-start-2 p-4 w-fit h-fit place-self-center hover:opacity-70 active:scale-95 cursor-pointer"
        onClick={() => dispatch(setMoreFeed(!isOpen))}
      >
        {isOpen ? (
          <MdOutlineExpandLess color="black" size={25} />
        ) : (
          <MdOutlineExpandMore color="black" size={25} />
        )}
      </div>
    </div>
  );
};

export default Main;
