import { FunctionComponent } from "react";
import { useDispatch } from "react-redux";
import FeedPublication from "../../../Common/Feed/FeedPublication";
import { MainPostProps } from "../types/post.types";

const MainPost: FunctionComponent<MainPostProps> = ({
  publicationData,
  fetchReactions,
  didMirror,
  getMoreMirrors,
}): JSX.Element => {
  const dispatch = useDispatch();
  return (
    <div className="relative w-full h-full row-start-1 grid grid-flow-col auto-cols-auto">
      <div className="relative w-full h-fit col-start-1 justify-self-center">
        <FeedPublication
          dispatch={dispatch}
          publication={publicationData}
          fetchReactions={fetchReactions}
          type={publicationData?.__typename === "Post" ? "Post" : "Mirror"}
          didMirror={didMirror}
          getMoreMirrors={getMoreMirrors}
        />
      </div>
    </div>
  );
};

export default MainPost;
