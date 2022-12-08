import { FunctionComponent } from "react";
import PostBox from "./modules/PostBox";

const Post: FunctionComponent = (): JSX.Element => {
  return (
    <div className="relative w-full h-full row-start-2 grid grid-flow-row auto-rows-auto bg-white">
      <PostBox />
    </div>
  );
};

export default Post;
