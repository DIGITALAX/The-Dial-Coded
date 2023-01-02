import { useState } from "react";
import getPublication from "../../../../graphql/queries/getPublication";
import lodash from "lodash";
import whoReactedublications from "../../../../graphql/queries/whoReactedPublication";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import {
  profilePublications,
  whoCommentedPublications,
} from "../../../../graphql/queries/profilePublication";
import fetchReactions from "../../../../lib/lens/helpers/fetchReactions";
import checkPostReactions from "../../../../lib/lens/helpers/checkPostReactions";
import checkIfMirrored from "../../../../lib/lens/helpers/checkIfMirrored";
import checkIfCommented from "../../../../lib/lens/helpers/checkIfCommented";

const usePostPage = () => {
  const [publicationDataLoading, setPublicationDataLoading] =
    useState<any>(false);
  const [publicationData, setPublicationData] = useState<any>();
  const [reactionsPostFeed, setReactionsFeedPost] = useState<any[]>([]);
  const [hasPostCommented, setHasPostCommented] = useState<boolean[]>([]);
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

      if (lensProfile) {
        const hasMirroredArr = await checkIfMirrored([data?.publication], lensProfile);
        setHasPostMirrored(hasMirroredArr);
        const hasCommentedArr = await checkIfCommented([data?.publication], lensProfile);
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
  };
};

export default usePostPage;
