import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  explorePublications,
  explorePublicationsAuth,
} from "../../../../../../../graphql/queries/explorePublications";
import { RootState } from "../../../../../../../redux/store";
import {
  PaginatedResultInfo,
  PublicationSearchResult,
} from "../../../../../../Common/types/lens.types";
import lodash from "lodash";
import {
  profilePublicationsAuth,
  profilePublications,
  whoCommentedPublications,
} from "../../../../../../../graphql/queries/profilePublication";
import feedTimeline from "../../../../../../../graphql/queries/feedTimeline";
import { useRouter } from "next/router";
import { setNoUserData } from "../../../../../../../redux/reducers/noUserDataSlice";
import orderFeedManual from "../../../../../../../lib/lens/helpers/orderFeedManual";
import checkPublicationTypes from "../../../../../../../lib/lens/helpers/checkPublicationTypes";
import checkPostReactions from "../../../../../../../lib/lens/helpers/checkPostReactions";
import checkIfMirrored from "../../../../../../../lib/lens/helpers/checkIfMirrored";
import checkIfCommented from "../../../../../../../lib/lens/helpers/checkIfCommented";
import checkIfMixtapeMirror from "../../../../../../../lib/lens/helpers/checkIfMixtapeMirror";
import getPostComments from "../../../../../../../lib/lens/helpers/getPostComments";

const useMainFeed = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const lensProfile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.id
  );
  const userView = useSelector(
    (state: RootState) => state.app.userViewerReducer?.value
  );
  const feedOrderState = useSelector(
    (state: RootState) => state.app.feedOrderReducer?.value
  );
  const feedPriorityState = useSelector(
    (state: RootState) => state.app.feedPriorityReducer?.value
  );
  const layout = useSelector(
    (state: RootState) => state.app.layoutReducer?.value
  );
  const hearted = useSelector(
    (state: RootState) => state.app.heartedReducer?.direction
  );
  const isConnected = useSelector(
    (state: RootState) => state.app.walletConnectedReducer?.value
  );
  const publicationModal = useSelector(
    (state: RootState) => state.app.publicationReducer?.value
  );
  const reactions = useSelector(
    (state: RootState) => state.app.reactionStateReducer
  );
  const indexerModal = useSelector(
    (state: RootState) => state.app.indexModalReducer
  );
  const [publicationsFeed, setPublicationsFeed] = useState<
    PublicationSearchResult[]
  >([]);
  const commentId = useSelector(
    (state: RootState) => state.app.commentShowReducer?.value
  );
  const commentShow = useSelector(
    (state: RootState) => state.app.commentShowReducer?.open
  );
  const [paginatedResults, setPaginatedResults] =
    useState<PaginatedResultInfo>();
  const [commentors, setCommentors] = useState<PublicationSearchResult[]>([]);
  const [commentPageInfo, setCommentPageInfo] = useState<PaginatedResultInfo>();
  const [reactionsFeed, setReactionsFeed] = useState<any[]>([]);
  const [hasReacted, setHasReacted] = useState<boolean[]>([]);
  const [hasMirrored, setHasMirrored] = useState<boolean[]>([]);
  const [hasCommented, setHasCommented] = useState<boolean[]>([]);
  const [commentInfoLoading, setCommentInfoLoading] = useState<boolean>(false);
  const [mixtapeMirror, setMixtapeMirror] = useState<boolean[]>([]);

  const fetchPublications = async (): Promise<void> => {
    const feedOrder = checkPublicationTypes(feedOrderState, feedPriorityState);
    try {
      const publicationsList = await explorePublications({
        sources: "thedial",
        publicationTypes: feedOrder,
        limit: 20,
        sortCriteria: "LATEST",
        noRandomize: true,
      });
      const arr: any[] = [...publicationsList?.data.explorePublications.items];
      const sortedArr: any[] = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      const filteredArr = lodash.filter(sortedArr, (arr) => {
        if (arr?.__typename === "Post") {
          if (!arr?.metadata?.content.includes("*Dial Mixtape*")) {
            return true;
          } else {
            return false;
          }
        } else {
          return true;
        }
      });
      setPublicationsFeed(filteredArr);
      setPaginatedResults(publicationsList?.data?.explorePublications.pageInfo);
      const mixtapeMirrors = checkIfMixtapeMirror(filteredArr);
      setMixtapeMirror(mixtapeMirrors);
      const response = await checkPostReactions(filteredArr, lensProfile);
      setReactionsFeed(response?.reactionsFeedArr);
    } catch (err: any) {
      console.error(err);
    }
  };

  const getUserSelectFeed = async (): Promise<void> => {
    const feedOrder = checkPublicationTypes(feedOrderState, feedPriorityState);
    let sortedArr: any[];
    let pageData: any;
    try {
      if (!lensProfile) {
        const { data } = await profilePublications({
          sources: "thedial",
          profileId: (userView as any)?.profileId,
          publicationTypes: feedOrder,
          limit: 20,
        });
        if (data?.publications?.items?.length < 1 || !data) {
          dispatch(setNoUserData(true));
          return;
        } else {
          dispatch(setNoUserData(false));
        }
        const arr: any[] = [...data?.publications?.items];
        sortedArr = arr.sort(
          (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
        );
        pageData = data?.publications?.pageInfo;
      } else {
        const { data } = await profilePublicationsAuth({
          sources: "thedial",
          profileId: (userView as any)?.profileId,
          publicationTypes: feedOrder,
          limit: 20,
        });
        if (data?.publications?.items?.length < 1 || !data) {
          dispatch(setNoUserData(true));
          return;
        } else {
          dispatch(setNoUserData(false));
        }
        const arr: any[] = [...data?.publications?.items];
        sortedArr = arr.sort(
          (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
        );
        pageData = data?.publications?.pageInfo;
      }
      const filteredArr = lodash.filter(sortedArr, (arr) => {
        if (arr?.__typename === "Post") {
          if (!arr?.metadata?.content.includes("*Dial Mixtape*")) {
            return true;
          } else {
            return false;
          }
        } else {
          return true;
        }
      });
      const orderedArr = orderFeedManual(
        filteredArr,
        feedOrderState,
        feedPriorityState
      );
      setPublicationsFeed(orderedArr);
      const mixtapeMirrors = checkIfMixtapeMirror(orderedArr);
      setMixtapeMirror(mixtapeMirrors);
      setPaginatedResults(pageData);
      const response = await checkPostReactions(orderedArr, lensProfile);
      setReactionsFeed(response?.reactionsFeedArr);
      if (lensProfile) {
        const hasMirroredArr = await checkIfMirrored(orderedArr, lensProfile);
        setHasMirrored(hasMirroredArr);
        const hasCommentedArr = await checkIfCommented(orderedArr, lensProfile);
        setHasCommented(hasCommentedArr);
        setHasReacted(response?.hasReactedArr);
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getFeedTimeline = async (): Promise<void> => {
    const feedOrder = checkPublicationTypes(feedOrderState, feedPriorityState);
    try {
      const { data } = await feedTimeline({
        profileId: lensProfile,
        limit: 50,
      });
      const arr: any[] = [...data.feed.items];
      const sortedArr: any[] = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      const filteredArr = lodash.filter(sortedArr, (arr) => {
        if (arr?.__typename === "Post") {
          if (!arr?.metadata?.content.includes("*Dial Mixtape*")) {
            return true;
          } else {
            return false;
          }
        } else {
          return true;
        }
      });
      if (sortedArr.length < 1) {
        const authPub = await explorePublicationsAuth({
          sources: "thedial",
          publicationTypes: feedOrder,
          limit: 20,
          sortCriteria: "LATEST",
          noRandomize: true,
        });
        const auth_arr: any[] = [...authPub?.data.explorePublications.items];
        const auth_sortedArr: any[] = auth_arr.sort(
          (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
        );
        const filteredArrAuth = lodash.filter(auth_sortedArr, (arr) => {
          if (arr?.__typename === "Post") {
            if (!arr?.metadata?.content.includes("*Dial Mixtape*")) {
              return true;
            } else {
              return false;
            }
          } else {
            return true;
          }
        });
        const orderedArr = orderFeedManual(
          filteredArrAuth,
          feedOrderState,
          feedPriorityState
        );
        setPublicationsFeed(orderedArr);
        const mixtapeMirrors = checkIfMixtapeMirror(orderedArr);
        setMixtapeMirror(mixtapeMirrors);
        setPaginatedResults(authPub.data.explorePublications.pageInfo);
        const response = await checkPostReactions(orderedArr, lensProfile);
        setHasReacted(response?.hasReactedArr);
        setReactionsFeed(response?.reactionsFeedArr);
        const hasMirroredArr = await checkIfMirrored(orderedArr, lensProfile);
        setHasMirrored(hasMirroredArr);
        const hasCommentedArr = await checkIfCommented(orderedArr, lensProfile);
        setHasCommented(hasCommentedArr);
      } else {
        const orderedArr = orderFeedManual(
          filteredArr,
          feedOrderState,
          feedPriorityState
        );
        setPublicationsFeed(orderedArr);
        const mixtapeMirrors = checkIfMixtapeMirror(orderedArr);
        setMixtapeMirror(mixtapeMirrors);
        setPaginatedResults(data.feed.pageInfo);
        const response = await checkPostReactions(orderedArr, lensProfile);
        setHasReacted(response?.hasReactedArr);
        setReactionsFeed(response?.reactionsFeedArr);
        const hasMirroredArr = await checkIfMirrored(orderedArr, lensProfile);
        setHasMirrored(hasMirroredArr);
        const hasCommentedArr = await checkIfCommented(orderedArr, lensProfile);
        setHasCommented(hasCommentedArr);
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  // fetch more
  const fetchMorePublications = async (): Promise<void> => {
    const feedOrder = checkPublicationTypes(feedOrderState, feedPriorityState);
    try {
      const morePublications = await explorePublications({
        sources: "thedial",
        publicationTypes: feedOrder,
        limit: 30,
        sortCriteria: "LATEST",
        noRandomize: true,
        cursor: paginatedResults?.next,
      });
      const arr: PublicationSearchResult[] = [
        ...morePublications?.data.explorePublications.items,
      ];
      const sortedArr: any[] = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      const filteredArr = lodash.filter(sortedArr, (arr) => {
        if (arr?.__typename === "Post") {
          if (!arr?.metadata?.content.includes("*Dial Mixtape*")) {
            return true;
          } else {
            return false;
          }
        } else {
          return true;
        }
      });
      setPublicationsFeed([...publicationsFeed, ...filteredArr]);
      setPaginatedResults(morePublications?.data.explorePublications.pageInfo);
      const mixtapeMirrors = checkIfMixtapeMirror(filteredArr);
      setMixtapeMirror([...mixtapeMirror, ...mixtapeMirrors]);
      const response = await checkPostReactions(filteredArr, lensProfile);
      setReactionsFeed([...reactionsFeed, ...response?.reactionsFeedArr]);
    } catch (err: any) {
      console.error(err);
    }
  };

  const getMoreFeedTimeline = async (): Promise<void> => {
    const feedOrder = checkPublicationTypes(feedOrderState, feedPriorityState);
    try {
      const morePublications = await feedTimeline({
        profileId: lensProfile,
        limit: 50,
        cursor: paginatedResults?.next,
      });
      const arr: PublicationSearchResult[] = [
        ...morePublications?.data.feed.items,
      ];
      const sortedArr: any[] = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      const filteredArr = lodash.filter(sortedArr, (arr) => {
        if (arr?.__typename === "Post") {
          if (!arr?.metadata?.content.includes("*Dial Mixtape*")) {
            return true;
          } else {
            return false;
          }
        } else {
          return true;
        }
      });
      if (filteredArr.length < 1) {
        const authPub = await explorePublicationsAuth({
          sources: "thedial",
          publicationTypes: feedOrder,
          limit: 20,
          sortCriteria: "LATEST",
          noRandomize: true,
          cursor: paginatedResults?.next,
        });
        const auth_arr: PublicationSearchResult[] = [
          ...authPub?.data.explorePublications.items,
        ];
        const auth_sortedArr: any[] = auth_arr.sort(
          (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
        );
        const filteredArrAuth = lodash.filter(auth_sortedArr, (arr) => {
          if (arr?.__typename === "Post") {
            if (!arr?.metadata?.content.includes("*Dial Mixtape*")) {
              return true;
            } else {
              return false;
            }
          } else {
            return true;
          }
        });
        const orderedArr = orderFeedManual(
          filteredArrAuth,
          feedOrderState,
          feedPriorityState
        );
        const mixtapeMirrors = checkIfMixtapeMirror(orderedArr);
        setMixtapeMirror([...mixtapeMirror, ...mixtapeMirrors]);
        setPublicationsFeed([...publicationsFeed, ...orderedArr]);
        setPaginatedResults(authPub?.data.explorePublications.pageInfo);
        const response = await checkPostReactions(orderedArr, lensProfile);
        setHasReacted([...hasReacted, ...response?.hasReactedArr]);
        setReactionsFeed([...reactionsFeed, ...response?.reactionsFeedArr]);
        const hasMirroredArr = await checkIfMirrored(orderedArr, lensProfile);
        setHasMirrored([...hasMirrored, ...hasMirroredArr]);
        const hasCommentedArr = await checkIfCommented(orderedArr, lensProfile);
        setHasCommented([...hasCommented, ...hasCommentedArr]);
      } else {
        const orderedArr = orderFeedManual(
          filteredArr,
          feedOrderState,
          feedPriorityState
        );
        const mixtapeMirrors = checkIfMixtapeMirror(orderedArr);
        setMixtapeMirror([...mixtapeMirror, ...mixtapeMirrors]);
        setPublicationsFeed([...publicationsFeed, ...orderedArr]);
        setPaginatedResults(morePublications?.data.feed.pageInfo);
        const response = await checkPostReactions(orderedArr, lensProfile);
        setHasReacted([...hasReacted, ...response?.hasReactedArr]);
        setReactionsFeed([...reactionsFeed, ...response?.reactionsFeedArr]);
        const hasMirroredArr = await checkIfMirrored(orderedArr, lensProfile);
        setHasMirrored([...hasMirrored, ...hasMirroredArr]);
        const hasCommentedArr = await checkIfCommented(orderedArr, lensProfile);
        setHasCommented([...hasCommented, ...hasCommentedArr]);
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getMoreUserSelectFeed = async (): Promise<void> => {
    const feedOrder = checkPublicationTypes(feedOrderState, feedPriorityState);
    let sortedArr: any[];
    let pageData: any;
    try {
      if (!lensProfile) {
        const { data } = await profilePublications({
          sources: "thedial",
          profileId: (userView as any)?.profileId,
          publicationTypes: feedOrder,
          limit: 20,
          cursor: paginatedResults?.next,
        });
        const arr: any[] = [...data?.publications?.items];
        sortedArr = arr.sort(
          (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
        );
        pageData = data?.publications?.pageInfo;
      } else {
        const { data } = await profilePublicationsAuth({
          sources: "thedial",
          profileId: (userView as any)?.profileId,
          publicationTypes: feedOrder,
          limit: 20,
          cursor: paginatedResults?.next,
        });
        const arr: any[] = [...data?.publications?.items];
        sortedArr = arr.sort(
          (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
        );
        pageData = data?.publications?.pageInfo;
      }
      const filteredArr = lodash.filter(sortedArr, (arr) => {
        if (arr?.__typename === "Post") {
          if (!arr?.metadata?.content.includes("*Dial Mixtape*")) {
            return true;
          } else {
            return false;
          }
        } else {
          return true;
        }
      });
      const orderedArr = orderFeedManual(
        filteredArr,
        feedOrderState,
        feedPriorityState
      );
      const mixtapeMirrors = checkIfMixtapeMirror(orderedArr);
      setMixtapeMirror([...mixtapeMirror, ...mixtapeMirrors]);
      setPublicationsFeed([...publicationsFeed, ...orderedArr]);
      setPaginatedResults(pageData);
      const response = await checkPostReactions(orderedArr, lensProfile);
      setReactionsFeed([...reactionsFeed, ...response?.reactionsFeedArr]);
      if (lensProfile) {
        const hasMirroredArr = await checkIfMirrored(orderedArr, lensProfile);
        setHasMirrored([...hasMirrored, ...hasMirroredArr]);
        const hasCommentedArr = await checkIfCommented(orderedArr, lensProfile);
        setHasCommented([...hasCommented, ...hasCommentedArr]);
        setHasReacted([...hasReacted, ...response?.hasReactedArr]);
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const fetchMoreFeed = async (): Promise<void> => {
    if (userView) {
      await getMoreUserSelectFeed();
    } else {
      if (!lensProfile) {
        await fetchMorePublications();
      } else {
        await getMoreFeedTimeline();
      }
    }
  };

  const getMorePostComments = async (id?: string): Promise<void> => {
    try {
      const comments = await whoCommentedPublications({
        commentsOf: id ? id : commentId,
        limit: 30,
        cursor: commentPageInfo?.next,
      });
      const arr: any[] = [...comments.data.publications.items];
      const sortedArr: any[] = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      setCommentors([...commentors, ...sortedArr]);
      setCommentPageInfo(comments.data.publications.pageInfo);
      const response = await checkPostReactions(sortedArr, lensProfile);
      setReactionsFeed([...reactionsFeed, ...response?.reactionsFeedArr]);
      if (lensProfile) {
        const hasMirroredArr = await checkIfMirrored(sortedArr, lensProfile);
        setHasMirrored([...hasMirrored, ...hasMirroredArr]);
        const hasCommentedArr = await checkIfCommented(sortedArr, lensProfile);
        setHasCommented([...hasCommented, ...hasCommentedArr]);
        setHasReacted([...hasReacted, ...response?.hasReactedArr]);
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (commentShow) {
      getPostComments(
        setCommentInfoLoading,
        setCommentors,
        setCommentPageInfo,
        setReactionsFeed,
        lensProfile,
        setHasMirrored,
        setHasCommented,
        setHasReacted,
        undefined,
        commentId
      );
    }
  }, [
    reactions.type,
    reactions.open,
    router.asPath,
    commentShow,
    reactions.value,
  ]);

  useEffect(() => {
    if (userView?.handle) {
      getUserSelectFeed();
    } else {
      if (!lensProfile) {
        fetchPublications();
      } else {
        getFeedTimeline();
      }
    }
  }, [
    isConnected,
    lensProfile,
    userView,
    layout,
    publicationModal,
    feedOrderState,
    feedPriorityState,
    commentShow,
    indexerModal.message,
    indexerModal.value,
    hearted,
  ]);

  return {
    publicationsFeed,
    fetchMoreFeed,
    hasReacted,
    reactionsFeed,
    hasMirrored,
    hasCommented,
    commentors,
    getMorePostComments,
    commentInfoLoading,
    mixtapeMirror,
    setCommentInfoLoading,
    setCommentors,
    setCommentPageInfo,
    setReactionsFeed,
    setHasMirrored,
    setHasCommented,
    setHasReacted,
  };
};

export default useMainFeed;
