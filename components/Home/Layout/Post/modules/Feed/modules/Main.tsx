import { FunctionComponent } from "react";
import { MainProps } from "../types/feed.types";
import { useDispatch } from "react-redux";
import FeedPublication from "../../../../../../Common/Feed/FeedPublication";
import { Post } from "../../../../../../Common/types/lens.types";
import InfiniteScroll from "react-infinite-scroll-component";

const Main: FunctionComponent<MainProps> = ({
  publicationsFeed,
  fetchMorePublications,
  isOpen,
}): JSX.Element => {
  const dispatch = useDispatch();
  return (
    <div
      className="relative w-[50vw] h-full col-start-1 grid grid-flow-row auto-rows-auto gap-5"
      id="targetDiv"
    >
      <InfiniteScroll
        scrollableTarget={"targetDiv"}
        height={isOpen ? undefined : "100rem"}
        loader={""}
        hasMore={true}
        next={fetchMorePublications}
        dataLength={publicationsFeed?.length}
        className={`relative row-start-1 w-full h-full overflow-y-scroll grid grid-flow-row auto-rows-auto gap-3`}
        style={{ color: "#131313", fontFamily: "Digi Reg" }}
      >
        {publicationsFeed?.map((publication: Post, index: number) => {
          return (
            <FeedPublication
              dispatch={dispatch}
              publication={publication}
              key={index}
            />
          );
        })}
      </InfiniteScroll>
    </div>
  );
};

export default Main;
