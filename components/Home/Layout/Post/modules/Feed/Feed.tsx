import { FunctionComponent } from "react";
import { FeedProps } from "../../types/post.types";
import Hot from "./modules/Hot";
import Main from "./modules/Main";

const Feed: FunctionComponent<FeedProps> = ({
  topTrending,
  topMixtape,
  topTracks,
  publicationsFeed,
}): JSX.Element => {
  return (
    <div className="relative row-start-3 w-full h-full grid grid-flow-col auto-cols-auto gap-6">
      <Main publicationsFeed={publicationsFeed} />
      <Hot
        topTrending={topTrending}
        topMixtape={topMixtape}
        topTracks={topTracks}
      />
    </div>
  );
};

export default Feed;
