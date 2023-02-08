import { FunctionComponent } from "react";
import { HotProps } from "../types/feed.types";
import lodash from "lodash";
import HotPublication from "../../../../../../Common/Feed/modules/HotPublication";
import InfiniteScroll from "react-infinite-scroll-component";
import HotFeedLoading from "../../../../../../Common/Loaders/HotFeedLoading";

const Hot: FunctionComponent<HotProps> = ({
  hotFeed,
  hasHotReacted,
  hasHotCommented,
  hasHotMirrored,
  hotReactionsFeed,
  fetchMoreMixtapes,
  isOpen,
  dispatch,
  handleHidePost,
  mixtapesLoading,
  firstMixLoad,
  hotFollowerOnly,
}): JSX.Element => {
  if (mixtapesLoading && firstMixLoad) {
    return <HotFeedLoading />;
  }
  return (
    <div
      className={`relative w-full h-full row-start-1 col-start-1 md:col-start-2 grid grid-flow-row auto-rows-auto gap-10`}
    >
      <div className="relative w-full h-fit row-start-1 grid grid-flow-col auto-cols-auto overflow-x-scroll gap-4">
        {(hotFeed[0]?.metadata as any)?.content
          ?.split("\n\n")[3]
          ?.split(",")
          ?.map((image: any, index: number) => {
            return (
              <HotPublication
                height={"80"}
                data={hotFeed?.[0]}
                image={image}
                index={index}
                key={index}
                dispatch={dispatch}
                reactionsFeed={hotReactionsFeed?.[0]}
                hasReacted={hasHotReacted?.[0]}
                hasMirrored={hasHotMirrored?.[0]}
                hasCommented={hasHotCommented?.[0]}
                handleHidePost={handleHidePost}
                followerOnly={hotFollowerOnly?.[0]}
              />
            );
          })}
      </div>
      <div className="relative w-full h-fit row-start-2 grid grid-flow-col auto-cols-auto gap-10 overflow-x-scroll">
        {(hotFeed[1]?.metadata as any)?.content
          ?.split("\n\n")[3]
          ?.split(",")
          ?.map((image: any, index: number) => {
            return (
              <HotPublication
                height={"72"}
                width={"96"}
                data={hotFeed[1]}
                image={image}
                index={index}
                key={index}
                dispatch={dispatch}
                reactionsFeed={hotReactionsFeed?.[1]}
                hasReacted={hasHotReacted?.[1]}
                hasMirrored={hasHotMirrored?.[1]}
                hasCommented={hasHotCommented?.[1]}
                handleHidePost={handleHidePost}
                followerOnly={hotFollowerOnly?.[1]}
              />
            );
          })}
      </div>
      <div className="relative w-full h-full row-start-3 grid grid-flow-row auto-rows-auto overflow-x-scroll">
        <InfiniteScroll
          height={"200rem"}
          loader={""}
          hasMore={true}
          next={fetchMoreMixtapes}
          dataLength={hotFeed?.length - 2}
          className={`relative row-start-1 w-full h-full overflow-y-scroll grid grid-flow-row auto-rows-auto gap-3`}
          style={{ color: "#131313", fontFamily: "Digi Reg" }}
        >
          {lodash.drop(hotFeed, 2)?.map((mixtape: any, indexOne: number) => {
            return (
              <div
                key={indexOne}
                className={
                  "relative w-full h-full gap-2 grid grid-flow-row auto-rows-auto"
                }
              >
                {mixtape?.metadata?.content
                  ?.split("\n\n")[3]
                  ?.split(",")
                  ?.map((image: any, indexTwo: number) => {
                    return (
                      <HotPublication
                        height="72"
                        key={indexTwo}
                        index={indexTwo}
                        data={mixtape}
                        image={image}
                        dispatch={dispatch}
                        reactionsFeed={hotReactionsFeed[indexOne + 2]}
                        hasReacted={hasHotReacted[indexOne + 2]}
                        hasMirrored={hasHotMirrored[indexOne + 2]}
                        hasCommented={hasHotCommented[indexOne + 2]}
                        handleHidePost={handleHidePost}
                        followerOnly={hotFollowerOnly?.[indexOne + 2]}
                      />
                    );
                  })}
              </div>
            );
          })}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default Hot;
