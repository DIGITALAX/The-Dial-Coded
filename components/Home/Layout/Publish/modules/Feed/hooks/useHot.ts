import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  explorePublications,
  explorePublicationsAuth,
} from "../../../../../../../graphql/queries/explorePublications";
import {
  profilePublications,
  profilePublicationsAuth,
} from "../../../../../../../graphql/queries/profilePublication";
import checkIfCommented from "../../../../../../../lib/lens/helpers/checkIfCommented";
import checkIfFollowerOnly from "../../../../../../../lib/lens/helpers/checkIfFollowerOnly";
import checkIfMirrored from "../../../../../../../lib/lens/helpers/checkIfMirrored";
import checkPostReactions from "../../../../../../../lib/lens/helpers/checkPostReactions";
import { setNoHotData } from "../../../../../../../redux/reducers/noHotDataSlice";
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
  const userView = useSelector(
    (state: RootState) => state.app.userViewerReducer?.value
  );
  const dispatch = useDispatch();
  const [hotFeed, setHotFeed] = useState<PublicationsQueryRequest[]>([]);
  const [paginatedHotResults, setPaginatedHotResults] = useState<any>();
  const [hotReactionsFeed, setHotReactionsFeed] = useState<any[]>([]);
  const [hasHotReacted, setHotHasReacted] = useState<boolean[]>([]);
  const [hasHotMirrored, setHotHasMirrored] = useState<boolean[]>([]);
  const [hasHotCommented, setHotHasCommented] = useState<boolean[]>([]);
  const [mixtapesLoading, setMixtapesLoading] = useState<boolean>(false);
  const [followerOnly, setFollowerOnly] = useState<boolean[]>([]);
  const [firstMixLoad, setFirstMixLoad] = useState<boolean>(true);
  const [hasMoreHot, setHasMoreHot] = useState<boolean>(true);

  const getMixtapes = async (): Promise<void> => {
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
      if (!sortedArr || sortedArr?.length < 20) {
        setHasMoreHot(false);
      } else {
        setHasMoreHot(true);
      }
      setHotFeed(sortedArr);
      const isOnlyFollowers = await checkIfFollowerOnly(sortedArr, lensProfile);
      setFollowerOnly(isOnlyFollowers as boolean[]);
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

  const getMoreMixtapes = async (): Promise<void> => {
    let sortedArr: any[];
    let pageData: any;
    try {
      if (!paginatedHotResults?.next) {
        setHasMoreHot(false);
        // fix apollo duplications on null next
        return;
      }
      setHasMoreHot(true);
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
          cursor: paginatedHotResults?.next,
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
          cursor: paginatedHotResults?.next,
        });
        const arr: any[] = [...data?.explorePublications?.items];
        sortedArr = arr.sort(
          (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
        );
        pageData = data?.explorePublications?.pageInfo;
      }
      setHotFeed([...hotFeed, ...sortedArr]);
      const isOnlyFollowers = await checkIfFollowerOnly(sortedArr, lensProfile);
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

  const getMixtapeUserSelect = async () => {
    let sortedArr: any[];
    let pageData: any;
    setMixtapesLoading(true);
    setHasMoreHot(true);
    try {
      if (!lensProfile) {
        const { data } = await profilePublications({
          sources: "thedial",
          profileId: (userView as any)?.profileId,
          publicationTypes: ["POST"],
          limit: 20,
          metadata: {
            tags: {
              all: ["dialMixtape"],
            },
          },
        });
        if (data?.publications?.items?.length < 1 || !data) {
          dispatch(setNoHotData(true));
          return;
        } else {
          dispatch(setNoHotData(false));
        }
        const arr: any[] = [...data?.explorePublications?.items];
        sortedArr = arr.sort(
          (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
        );
        pageData = data?.explorePublications?.pageInfo;
      } else {
        const { data } = await profilePublicationsAuth({
          sources: "thedial",
          profileId: (userView as any)?.profileId,
          publicationTypes: ["POST"],
          limit: 20,
          metadata: {
            tags: {
              all: ["dialMixtape"],
            },
          },
        });
        if (data?.publications?.items?.length < 1 || !data) {
          dispatch(setNoHotData(true));
          return;
        } else {
          dispatch(setNoHotData(false));
        }
        const arr: any[] = [...data?.explorePublications?.items];
        sortedArr = arr.sort(
          (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
        );
        pageData = data?.explorePublications?.pageInfo;
      }
      setHotFeed(sortedArr);
      const isOnlyFollowers = await checkIfFollowerOnly(sortedArr, lensProfile);
      setFollowerOnly(isOnlyFollowers as boolean[]);
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

  const getMoreMixtapeUserSelect = async () => {
    let sortedArr: any[];
    let pageData: any;
    try {
      if (!lensProfile) {
        if (!paginatedHotResults?.next) {
          setHasMoreHot(false);
          // fix apollo duplications on null next
          return;
        }
        setHasMoreHot(true);
        const { data } = await explorePublications({
          profileId: (userView as any)?.profileId,
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
          setHasMoreHot(false);
          // fix apollo duplications on null next
          return;
        }
        setHasMoreHot(true);
        const { data } = await explorePublicationsAuth({
          profileId: (userView as any)?.profileId,
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
      const isOnlyFollowers = await checkIfFollowerOnly(sortedArr, lensProfile);
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

  const fetchMoreMixtapes = async (): Promise<void> => {
    if (userView) {
      await getMoreMixtapeUserSelect();
    } else {
      getMoreMixtapes();
    }
  };

  useEffect(() => {
    if (userView?.handle) {
      getMixtapeUserSelect();
    } else {
      getMixtapes();
    }
  }, [
    isConnected,
    lensProfile,
    mixtapeAdded,
    commentShow,
    indexerModal.message,
    indexerModal.value,
    userView,
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
    hasMoreHot,
  };
};

export default useHot;
