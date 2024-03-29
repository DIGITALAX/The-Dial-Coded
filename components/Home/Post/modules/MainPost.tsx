import { FunctionComponent } from "react";
import { useDispatch } from "react-redux";
import FeedPublication from "../../../Common/Feed/modules/FeedPublication";
import { MainPostProps } from "../types/post.types";

const MainPost: FunctionComponent<MainPostProps> = ({
  publicationData,
  hasPostMirrored,
  hasPostCommented,
  hasPostReacted,
  reactionsPostFeed,
  handleHidePost,
  followerOnly,
  reactionLoaded
}): JSX.Element => {
  const dispatch = useDispatch();
  return (
    <div className="relative w-full h-full row-start-1 grid grid-flow-col auto-cols-auto">
      <div className="relative w-full h-fit col-start-1 justify-self-center">
        <FeedPublication
          dispatch={dispatch}
          publication={publicationData}
          type={
            publicationData?.__typename === "Post"
              ? "Post"
              : publicationData?.__typename === "Mirror"
              ? "Mirror"
              : "Comment"
          }
          hasMirrored={hasPostMirrored?.length > 0 && hasPostMirrored[0]}
          hasCommented={hasPostCommented?.length > 0 && hasPostCommented[0]}
          hasReacted={hasPostReacted?.length > 0 && hasPostReacted[0]}
          reactionsFeed={reactionsPostFeed?.length > 0 && reactionsPostFeed[0]}
          handleHidePost={handleHidePost}
          followerOnly={followerOnly}
          reactionLoaded={reactionLoaded?.[0]}
        />
      </div>
    </div>
  );
};

export default MainPost;
