import { FunctionComponent } from "react";
import { useDispatch } from "react-redux";
import MixtapePublication from "../../Common/Feed/modules/MixtapePublication";
import { MainPostMixtapeProps } from "./types/mixtape.types";

const MainPost: FunctionComponent<MainPostMixtapeProps> = ({
  publicationData,
  hasPostMirrored,
  hasPostCommented,
  hasPostReacted,
  reactionsPostFeed,
}): JSX.Element => {
  const dispatch = useDispatch();
  return (
    <div className="relative w-full h-full row-start-1 grid grid-flow-col auto-cols-auto">
      <div className="relative w-full h-fit col-start-1 justify-self-center">
        <MixtapePublication
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
        />
      </div>
    </div>
  );
};

export default MainPost;
