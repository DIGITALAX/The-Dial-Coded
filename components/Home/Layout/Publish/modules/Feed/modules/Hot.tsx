import { FunctionComponent } from "react";
import { HotProps } from "../types/feed.types";
import lodash from "lodash";
import HotPublication from "../../../../../../Common/Feed/modules/HotPublication";
import InfiniteScroll from "react-infinite-scroll-component";

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
}): JSX.Element => {
  console.log(hotFeed[0], "here");
  return (
    <div
      className={`relative w-full ${
        isOpen ? "h-fit overflow-y-visible" : "h-[100rem] overflow-y-scroll"
      } col-start-2 grid grid-flow-row auto-rows-auto gap-10`}
    >
      <div className="relative w-full h-fit row-start-1 grid grid-flow-col auto-cols-auto overflow-x-scroll gap-4">
        {(hotFeed[0]?.metadata as any)?.content
          ?.split("\n\n")[3]
          ?.split(",")
          ?.map((image: any, index: number) => {
            return (
              <HotPublication
                height={"80"}
                data={hotFeed[0]}
                image={image}
                index={index}
                key={index}
                dispatch={dispatch}
                reactionsFeed={hotReactionsFeed[0]}
                hasReacted={hasHotReacted[0]}
                hasMirrored={hasHotMirrored[0]}
                hasCommented={hasHotCommented[0]}
                handleHidePost={handleHidePost}
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
                height={"60"}
                width={"96"}
                data={hotFeed[1]}
                image={image}
                index={index}
                key={index}
                dispatch={dispatch}
                reactionsFeed={hotReactionsFeed[1]}
                hasReacted={hasHotReacted[1]}
                hasMirrored={hasHotMirrored[1]}
                hasCommented={hasHotCommented[1]}
                handleHidePost={handleHidePost}
              />
            );
          })}
      </div>
      <div className="relative w-full h-full row-start-3 grid grid-flow-row auto-rows-auto overflow-x-scroll">
        <InfiniteScroll
          height={isOpen ? undefined : "100rem"}
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
