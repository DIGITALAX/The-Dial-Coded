import { useState } from "react";
import getPublication from "../../../../graphql/queries/getPublication";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import checkPostReactions from "../../../../lib/lens/helpers/checkPostReactions";
import checkIfMirrored from "../../../../lib/lens/helpers/checkIfMirrored";
import checkIfCommented from "../../../../lib/lens/helpers/checkIfCommented";
import checkIfFollowerOnly from "../../../../lib/lens/helpers/checkIfFollowerOnly";

const usePostPage = () => {
  const [publicationDataLoading, setPublicationDataLoading] =
    useState<any>(false);
  const [publicationData, setPublicationData] = useState<any>();
  const [reactionsPostFeed, setReactionsFeedPost] = useState<any[]>([]);
  const [hasPostCommented, setHasPostCommented] = useState<boolean[]>([]);
  const [followerOnly, setFollowerOnly] = useState<boolean>(false);
  const [hasPostMirrored, setHasPostMirrored] = useState<boolean[]>([]);
  const [hasPostReacted, setHasPostReacted] = useState<boolean[]>([]);
  const lensProfile = useSelector(
    (state: RootState) => state.app.lensProfileReducer?.profile?.id
  );

  const getPublicationData = async (id: string): Promise<void> => {
    setPublicationDataLoading(true);
    try {
      const { data } = await getPublication({
        publicationId: id,
      });
      setPublicationData(data?.publication);
      const response = await checkPostReactions(
        [data?.publication],
        lensProfile
      );
      const isOnlyFollowers = await checkIfFollowerOnly(
        data?.publication,
        lensProfile
      );
      setFollowerOnly(isOnlyFollowers as boolean);
      if (lensProfile) {
        const hasMirroredArr = await checkIfMirrored(
          [data?.publication],
          lensProfile
        );
        setHasPostMirrored(hasMirroredArr);
        const hasCommentedArr = await checkIfCommented(
          [data?.publication],
          lensProfile
        );
        setHasPostCommented(hasCommentedArr);
        setHasPostReacted(response?.hasReactedArr);
      }
      setReactionsFeedPost(response?.reactionsFeedArr);
    } catch (err: any) {
      console.error(err.message);
    }
    setPublicationDataLoading(false);
  };

  return {
    publicationDataLoading,
    getPublicationData,
    publicationData,
    reactionsPostFeed,
    hasPostCommented,
    hasPostMirrored,
    hasPostReacted,
    followerOnly,
  };
};

export default usePostPage;
