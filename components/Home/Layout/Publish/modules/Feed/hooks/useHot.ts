import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  explorePublications,
  explorePublicationsAuth,
} from "../../../../../../../graphql/queries/explorePublications";
import checkIfCommented from "../../../../../../../lib/lens/helpers/checkIfCommented";
import checkIfFollowerOnly from "../../../../../../../lib/lens/helpers/checkIfFollowerOnly";
import checkIfMirrored from "../../../../../../../lib/lens/helpers/checkIfMirrored";
import checkPostReactions from "../../../../../../../lib/lens/helpers/checkPostReactions";
import { RootState } from "../../../../../../../redux/store";
import { PublicationsQueryRequest } from "../../../../../../Common/types/lens.types";
import { UseHotResults } from "../types/feed.types";

const useHot = (): UseHotResults => {
  const lensProfile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.id
  );
  const isConnected = useSelector(
    (state: RootState) => state.app.walletConnectedReducer?.value
  );
  const mixtapeAdded = useSelector(
    (state: RootState) => state.app.mixtapePageReducer.value
  );
  const commentShow = useSelector(
    (state: RootState) => state.app.commentShowReducer?.open
  );
  const indexerModal = useSelector(
    (state: RootState) => state.app.indexModalReducer
  );
  const [hotFeed, setHotFeed] = useState<PublicationsQueryRequest[]>([]);
  const [paginatedHotResults, setPaginatedHotResults] = useState<any>();
  const [hotReactionsFeed, setHotReactionsFeed] = useState<any[]>([]);
  const [hasHotReacted, setHotHasReacted] = useState<boolean[]>([]);
  const [hasHotMirrored, setHotHasMirrored] = useState<boolean[]>([]);
  const [hasHotCommented, setHotHasCommented] = useState<boolean[]>([]);
  const [mixtapesLoading, setMixtapesLoading] = useState<boolean>(false);
  const [followerOnly, setFollowerOnly] = useState<boolean[]>([]);
  const [firstMixLoad, setFirstMixLoad] = useState<boolean>(true);

  const fetchMixtapes = async (): Promise<void> => {
    let sortedArr: any[];
    let pageData: any;
    setMixtapesLoading(true);
    try {
      if (!lensProfile) {
        const { data } = await explorePublications({
          sources: "thedial",
          publicationTypes: ["POST"],
          limit: 20,
          sortCriteria: "LATEST",
          metadata: {
            tags: {
              all: ["dialMixtape"],
            },
          },
          noRandomize: true,
        });
        const arr: any[] = [...data?.explorePublications?.items];
        sortedArr = arr.sort(
          (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
        );
        pageData = data?.explorePublications?.pageInfo;
      } else {
        const { data } = await explorePublicationsAuth({
          sources: "thedial",
          publicationTypes: ["POST"],
          limit: 20,
          sortCriteria: "LATEST",
          metadata: {
            tags: {
              all: ["dialMixtape"],
            },
          },
          noRandomize: true,
        });
        const arr: any[] = [...data?.explorePublications?.items];
        sortedArr = arr.sort(
          (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
        );
        pageData = data?.explorePublications?.pageInfo;
      }
      setHotFeed(sortedArr);
      if (lensProfile) {
        const isOnlyFollowers = await checkIfFollowerOnly(
          sortedArr,
          lensProfile
        );
        setFollowerOnly(isOnlyFollowers as boolean[]);
      } else {
        const isOnlyFollowers = await checkIfFollowerOnly(sortedArr, undefined);
        setFollowerOnly(isOnlyFollowers as boolean[]);
      }
      setPaginatedHotResults(pageData);
      setMixtapesLoading(false);
      setFirstMixLoad(false);
      const response = await checkPostReactions(sortedArr, lensProfile);
      setHotReactionsFeed(response?.reactionsFeedArr);
      if (lensProfile) {
        const hasMirroredArr = await checkIfMirrored(sortedArr, lensProfile);
        setHotHasMirrored(hasMirroredArr);
        const hasCommentedArr = await checkIfCommented(sortedArr, lensProfile);
        setHotHasCommented(hasCommentedArr);
        setHotHasReacted(response?.hasReactedArr);
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const fetchMoreMixtapes = async (): Promise<void> => {
    let sortedArr: any[];
    let pageData: any;
    try {
      if (!lensProfile) {
        if (!paginatedHotResults?.next) {
          // fix apollo duplications on null next
          return;
        }
        const { data } = await explorePublications({
          sources: "thedial",
          publicationTypes: ["POST"],
          limit: 20,
          sortCriteria: "LATEST",
          metadata: {
            tags: {
              all: ["dialMixtape"],
            },
          },
          noRandomize: true,
          cursor: paginatedHotResults?.next,
        });
        const arr: any[] = [...data?.explorePublications?.items];
        sortedArr = arr.sort(
          (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
        );
        pageData = data?.explorePublications?.pageInfo;
      } else {
        if (!paginatedHotResults?.next) {
          // fix apollo duplications on null next
          return;
        }
        const { data } = await explorePublicationsAuth({
          sources: "thedial",
          publicationTypes: ["POST"],
          limit: 20,
          sortCriteria: "LATEST",
          metadata: {
            tags: {
              all: ["dialMixtape"],
            },
          },
          noRandomize: true,
          cursor: paginatedHotResults?.next,
        });
        const arr: any[] = [...data?.explorePublications?.items];
        sortedArr = arr.sort(
          (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
        );
        pageData = data?.explorePublications?.pageInfo;
      }
      setHotFeed([...hotFeed, ...sortedArr]);
      const isOnlyFollowers = await checkIfFollowerOnly(sortedArr, undefined);
      setFollowerOnly([...followerOnly, ...(isOnlyFollowers as boolean[])]);
      setPaginatedHotResults(pageData);
      const response = await checkPostReactions(sortedArr, lensProfile);
      setHotReactionsFeed([...hotReactionsFeed, ...response?.reactionsFeedArr]);
      if (lensProfile) {
        const hasMirroredArr = await checkIfMirrored(sortedArr, lensProfile);
        setHotHasMirrored([...hasHotMirrored, ...hasMirroredArr]);
        const hasCommentedArr = await checkIfCommented(sortedArr, lensProfile);
        setHotHasCommented([...hasHotCommented, ...hasCommentedArr]);
        setHotHasReacted([...hasHotReacted, ...response?.hasReactedArr]);
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMixtapes();
  }, [
    isConnected,
    lensProfile,
    mixtapeAdded,
    commentShow,
    indexerModal.message,
    indexerModal.value,
    // hearted,
  ]);

  return {
    hotFeed,
    hasHotReacted,
    hasHotCommented,
    hasHotMirrored,
    hotReactionsFeed,
    fetchMoreMixtapes,
    mixtapesLoading,
    firstMixLoad,
    followerOnly,
  };
};

export default useHot;
