import { FunctionComponent } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import FeedPublication from "../../../../../Common/Feed/modules/FeedPublication";
import { PublicationsFoundProps } from "./types/publications.types";

const PublicationsFound: FunctionComponent<PublicationsFoundProps> = ({
  publicationsSearch,
  dispatch,
  hasMirrored,
  hasReacted,
  reactionsFeed,
  hasCommented,
  mixtapeMirror,
  handleHidePost,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit grid grid-flow-col auto-cols-auto">
      {publicationsSearch?.map((publication: any, index: number) => {
        console.log(publication)
        return (
          <FeedPublication
            dispatch={dispatch}
            publication={publication}
            key={index}
            type={"Post"}
            hasMirrored={hasMirrored?.length > 0 && hasMirrored[index]}
            hasReacted={hasReacted?.length > 0 && hasReacted[index]}
            reactionsFeed={reactionsFeed?.length > 0 && reactionsFeed[index]}
            hasCommented={hasCommented?.length > 0 && hasCommented[index]}
            mixtapeMirror={mixtapeMirror?.length > 0 && mixtapeMirror[index]}
            handleHidePost={handleHidePost}
          />
        );
      })}
    </div>
  );
};

export default PublicationsFound;
