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
  console.log(publicationData)
  return (
    <div className="relative w-full h-screen col-start-1 grid grid-flow-col auto-cols-auto top-60 md:top-44 rounded-t-md bg-white/90 opacity-100">
      <div className="relative w-4/5 h-fit col-start-1 justify-self-center top-20">
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
