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
import whoReactedublications from "../../../../../../../graphql/queries/whoReactedPublication";
import {
  profilePublicationsAuth,
  profilePublications,
  whoCommentedPublications,
} from "../../../../../../../graphql/queries/profilePublication";
import feedTimeline from "../../../../../../../graphql/queries/feedTimeline";
import { useRouter } from "next/router";
import { setNoUserData } from "../../../../../../../redux/reducers/noUserDataSlice";

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

  const checkPublicationTypes = (): string[] => {
    let feedOrder: string[];
    if (!feedOrderState && !feedPriorityState) {
      feedOrder = ["POST"];
    } else {
      if (feedPriorityState === "interests") {
        if (feedOrderState === "chrono") {
          feedOrder = ["POST"];
        } else {
          feedOrder = ["POST", "COMMENT", "MIRROR"];
        }
      } else {
        if (feedOrderState === "algo") {
          feedOrder = ["COMMENT", "MIRROR"];
        } else {
          feedOrder = ["COMMENT"];
        }
      }
    }
    return feedOrder;
  };

  const orderFeedManual = (
    arr: PublicationSearchResult[]
  ): PublicationSearchResult[] => {
    let orderedArr: PublicationSearchResult[];
    if (!feedOrderState && !feedPriorityState) {
      orderedArr = lodash.filter(
        arr,
        (item) => (item?.__typename as string) === "Post"
      );
    } else {
      if (feedPriorityState === "interests") {
        if (feedOrderState === "chrono") {
          orderedArr = lodash.filter(
            arr,
            (item) => (item?.__typename as string) === "Post"
          );
        } else {
          orderedArr = arr;
        }
      } else {
        if (feedOrderState === "algo") {
          orderedArr = lodash.filter(
            arr,
            (item) =>
              (item?.__typename as string) === "Comment" ||
              (item?.__typename as string) === "Mirror"
          );
        } else {
          orderedArr = lodash.filter(
            arr,
            (item) => (item?.__typename as string) === "Comment"
          );
        }
      }
    }
    return orderedArr;
  };

  const fetchReactions = async (pubId: string): Promise<any> => {
    try {
      const reactions = await whoReactedublications({
        publicationId: pubId,
      });
      const upvoteArr = lodash.filter(
        reactions?.data?.whoReactedPublication.items,
        (item) => item.reaction === "UPVOTE"
      );
      return upvoteArr;
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const checkPostReactions = async (arr: any[]): Promise<any> => {
    let reactionsFeedArr: any[] = [];
    let hasReactedArr: any[] = [];
    try {
      for (let pub = 0; pub < arr?.length; pub++) {
        const reactions = await fetchReactions(arr[pub]?.id);
        reactionsFeedArr.push(reactions.length);
        const checkReacted = lodash.filter(
          reactions,
          (arr) => arr?.profile?.id === lensProfile
        );
        hasReactedArr.push(checkReacted.length > 0 ? true : false);
      }
      return { hasReactedArr, reactionsFeedArr };
    } catch (err: any) {
      console.error(err.message);
    }
  };

  // did mirror
  const checkIfMirrored = async (arr: any[]): Promise<any> => {
    try {
      const { data } = await profilePublications({
        profileId: lensProfile,
        publicationTypes: ["MIRROR"],
        limit: 50,
      });
      const array_data = [...data.publications.items];
      const sortedArr = array_data.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      let mirroredArray: any[] = sortedArr;
      let loopMirroredArray: any[] = sortedArr;
      let pageData: any;
      while (loopMirroredArray.length === 50) {
        const { mirroredValues, paginatedData } = await checkIfMoreMirrored(
          pageData ? pageData : data?.publications?.pageInfo
        );
        loopMirroredArray = mirroredValues;
        pageData = paginatedData;
        mirroredArray = [...mirroredArray, ...mirroredValues];
      }
      let hasMirroredArr: boolean[] = [];
      for (let i = 0; i < arr.length; i++) {
        const mirrorLength = lodash.filter(
          mirroredArray,
          (mirror) => mirror?.mirrorOf?.id === arr[i]?.id
        );
        if (mirrorLength?.length > 0) {
          hasMirroredArr.push(true);
        } else {
          hasMirroredArr.push(false);
        }
      }
      return hasMirroredArr;
    } catch (err: any) {
      console.error(err);
    }
  };

  const checkIfMoreMirrored = async (pageData: any): Promise<any> => {
    try {
      const { data } = await profilePublications({
        profileId: lensProfile,
        publicationTypes: ["MIRROR"],
        limit: 50,
        cursor: pageData?.next,
      });
      const arr = [...data.publications.items];
      const mirroredValues = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      const paginatedData = data?.publications?.pageInfo;
      return { mirroredValues, paginatedData };
    } catch (err: any) {
      console.error(err);
    }
  };

  //did comment
  const checkIfCommented = async (inputArr: any[]): Promise<any> => {
    let hasCommentedArr: boolean[] = [];
    try {
      for (let i = 0; i < inputArr.length; i++) {
        const comments = await whoCommentedPublications({
          commentsOf: inputArr[i]?.id,
          limit: 50,
        });
        const arr: any[] = [...comments.data.publications.items];
        const sortedArr: any[] = arr.sort(
          (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
        );
        let commentedArray: any[] = sortedArr;
        let loopCommentedArray: any[] = sortedArr;
        let pageData: any;
        while (loopCommentedArray.length === 50) {
          const { commentedValues, paginatedData } = await checkIfMoreCommented(
            pageData ? pageData : comments?.data?.publications?.pageInfo,
            inputArr[i]?.id
          );
          loopCommentedArray = commentedValues;
          pageData = paginatedData;
          commentedArray = [...commentedArray, ...commentedValues];
        }
        const commentLength = lodash.filter(
          commentedArray,
          (comment) => comment?.profile.id === lensProfile
        );
        if (commentLength?.length > 0) {
          hasCommentedArr.push(true);
        } else {
          hasCommentedArr.push(false);
        }
      }
      return hasCommentedArr;
    } catch (err: any) {
      console.error(err.any);
    }
  };

  const checkIfMoreCommented = async (
    pageData: any,
    id: string
  ): Promise<any> => {
    try {
      const comments = await whoCommentedPublications({
        commentsOf: id,
        limit: 30,
        cursor: pageData?.next,
      });
      const arr: any[] = [...comments.data.publications.items];
      const commentedValues: any[] = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      const paginatedData = comments.data.publications.pageInfo;
      return { commentedValues, paginatedData };
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const fetchPublications = async (): Promise<void> => {
    const feedOrder = checkPublicationTypes();
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
      setPublicationsFeed(sortedArr);
      setPaginatedResults(publicationsList?.data?.explorePublications.pageInfo);
      const response = await checkPostReactions(sortedArr);
      setReactionsFeed(response?.reactionsFeedArr);
    } catch (err: any) {
      console.error(err);
    }
  };

  const getUserSelectFeed = async (): Promise<void> => {
    const feedOrder = checkPublicationTypes();
    let sortedArr: any[];
    let pageData: any;
    try {
      if (!lensProfile) {
        const { data } = await profilePublications({
          profileId: userView?.id,
          publicationTypes: feedOrder,
          limit: 20,
        });
        if (!data) {
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
          profileId: userView?.id,
          publicationTypes: feedOrder,
          limit: 20,
        });
        if (!data) {
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
      const orderedArr = orderFeedManual(sortedArr);
      setPublicationsFeed(orderedArr);
      setPaginatedResults(pageData);
      const response = await checkPostReactions(orderedArr);
      setReactionsFeed(response?.reactionsFeedArr);
      if (lensProfile) {
        const hasMirroredArr = await checkIfMirrored(orderedArr);
        setHasMirrored(hasMirroredArr);
        const hasCommentedArr = await checkIfCommented(orderedArr);
        setHasCommented(hasCommentedArr);
        setHasReacted(response?.hasReactedArr);
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getFeedTimeline = async (): Promise<void> => {
    const feedOrder = checkPublicationTypes();
    try {
      const { data } = await feedTimeline({
        profileId: lensProfile,
        limit: 50,
      });
      const arr: any[] = [...data.feed.items];
      const sortedArr: any[] = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
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
        const orderedArr = orderFeedManual(auth_sortedArr);
        setPublicationsFeed(orderedArr);
        setPaginatedResults(authPub.data.explorePublications.pageInfo);
        const response = await checkPostReactions(orderedArr);
        setHasReacted(response?.hasReactedArr);
        setReactionsFeed(response?.reactionsFeedArr);
        const hasMirroredArr = await checkIfMirrored(orderedArr);
        setHasMirrored(hasMirroredArr);
        const hasCommentedArr = await checkIfCommented(orderedArr);
        setHasCommented(hasCommentedArr);
      } else {
        const orderedArr = orderFeedManual(sortedArr);
        setPublicationsFeed(orderedArr);
        setPaginatedResults(data.feed.pageInfo);
        const response = await checkPostReactions(orderedArr);
        setHasReacted(response?.hasReactedArr);
        setReactionsFeed(response?.reactionsFeedArr);
        const hasMirroredArr = await checkIfMirrored(orderedArr);
        setHasMirrored(hasMirroredArr);
        const hasCommentedArr = await checkIfCommented(orderedArr);
        setHasCommented(hasCommentedArr);
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  // fetch more
  const fetchMorePublications = async (): Promise<void> => {
    const feedOrder = checkPublicationTypes();
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
      const sortedArr: PublicationSearchResult[] = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      setPublicationsFeed([...publicationsFeed, ...sortedArr]);
      setPaginatedResults(morePublications?.data.explorePublications.pageInfo);
      const response = await checkPostReactions(sortedArr);
      setReactionsFeed([...reactionsFeed, ...response?.reactionsFeedArr]);
    } catch (err: any) {
      console.error(err);
    }
  };

  const getMoreFeedTimeline = async (): Promise<void> => {
    const feedOrder = checkPublicationTypes();
    try {
      const morePublications = await feedTimeline({
        profileId: lensProfile,
        limit: 50,
        cursor: paginatedResults?.next,
      });
      const arr: PublicationSearchResult[] = [
        ...morePublications?.data.feed.items,
      ];
      const sortedArr: PublicationSearchResult[] = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      if (sortedArr.length < 1) {
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
        const auth_sortedArr: PublicationSearchResult[] = auth_arr.sort(
          (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
        );
        const orderedArr = orderFeedManual(auth_sortedArr);
        setPublicationsFeed([...publicationsFeed, ...orderedArr]);
        setPaginatedResults(authPub?.data.explorePublications.pageInfo);
        const response = await checkPostReactions(orderedArr);
        setHasReacted([...hasReacted, ...response?.hasReactedArr]);
        setReactionsFeed([...reactionsFeed, ...response?.reactionsFeedArr]);
        const hasMirroredArr = await checkIfMirrored(orderedArr);
        setHasMirrored([...hasMirrored, ...hasMirroredArr]);
        const hasCommentedArr = await checkIfCommented(orderedArr);
        setHasCommented([...hasCommented, ...hasCommentedArr]);
      } else {
        const orderedArr = orderFeedManual(sortedArr);
        setPublicationsFeed([...publicationsFeed, ...orderedArr]);
        setPaginatedResults(morePublications?.data.feed.pageInfo);
        const response = await checkPostReactions(orderedArr);
        setHasReacted([...hasReacted, ...response?.hasReactedArr]);
        setReactionsFeed([...reactionsFeed, ...response?.reactionsFeedArr]);
        const hasMirroredArr = await checkIfMirrored(orderedArr);
        setHasMirrored([...hasMirrored, ...hasMirroredArr]);
        const hasCommentedArr = await checkIfCommented(orderedArr);
        setHasCommented([...hasCommented, ...hasCommentedArr]);
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getMoreUserSelectFeed = async (): Promise<void> => {
    const feedOrder = checkPublicationTypes();
    let sortedArr: any[];
    let pageData: any;
    try {
      if (!lensProfile) {
        const { data } = await profilePublications({
          profileId: userView?.id,
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
          profileId: userView?.id,
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
      const orderedArr = orderFeedManual(sortedArr);
      setPublicationsFeed(orderedArr);
      setPaginatedResults(pageData);
      const response = await checkPostReactions(orderedArr);
      setReactionsFeed([...reactionsFeed, ...response?.reactionsFeedArr]);
      if (lensProfile) {
        const hasMirroredArr = await checkIfMirrored(orderedArr);
        setHasMirrored([...hasMirrored, ...hasMirroredArr]);
        const hasCommentedArr = await checkIfCommented(orderedArr);
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

  const getPostComments = async (id?: string): Promise<void> => {
    setCommentInfoLoading(true);
    try {
      const comments = await whoCommentedPublications({
        commentsOf: id ? id : commentId,
        limit: 30,
      });
      const arr: any[] = [...comments.data.publications.items];
      const sortedArr: any[] = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      setCommentors(sortedArr);
      setCommentPageInfo(comments.data.publications.pageInfo);
      const response = await checkPostReactions(sortedArr);
      setReactionsFeed(response?.reactionsFeedArr);
      if (lensProfile) {
        const hasMirroredArr = await checkIfMirrored(sortedArr);
        setHasMirrored(hasMirroredArr);
        const hasCommentedArr = await checkIfCommented(sortedArr);
        setHasCommented(hasCommentedArr);
        setHasReacted(response?.hasReactedArr);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setCommentInfoLoading(false);
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
      const response = await checkPostReactions(sortedArr);
      setReactionsFeed([...reactionsFeed, ...response?.reactionsFeedArr]);
      if (lensProfile) {
        const hasMirroredArr = await checkIfMirrored(sortedArr);
        setHasMirrored([...hasMirrored, ...hasMirroredArr]);
        const hasCommentedArr = await checkIfCommented(sortedArr);
        setHasCommented([...hasCommented, ...hasCommentedArr]);
        setHasReacted([...hasReacted, ...response?.hasReactedArr]);
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (commentShow) {
      getPostComments();
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
    // dependencies
    // logged in person made a reaction of some kind (mirror, collect, comment?, heart)
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
    getPostComments,
  };
};

export default useMainFeed;
