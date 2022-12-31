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
import hidePublication from "../../../../../../../graphql/mutations/hidePublication";
import { setIndexModal } from "../../../../../../../redux/reducers/indexModalSlice";

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

  const checkIfMixtapeMirror = (arr: any[]): boolean[] => {
    let checkedArr: boolean[] = [];
    lodash.filter(arr, (item) => {
      if (item?.__typename === "Mirror") {
        if (item?.mirrorOf?.metadata?.content.includes("*Dial Mixtape*"))
          checkedArr.push(true);
      } else {
        checkedArr.push(false);
      }
    });

    return checkedArr;
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
      const response = await checkPostReactions(filteredArr);
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
      const orderedArr = orderFeedManual(filteredArr);
      setPublicationsFeed(orderedArr);
      const mixtapeMirrors = checkIfMixtapeMirror(orderedArr);
      setMixtapeMirror(mixtapeMirrors);
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
        console.log(authPub.data.explorePublications.pageInfo, "forst data")
        const orderedArr = orderFeedManual(filteredArrAuth);
        setPublicationsFeed(orderedArr);
        const mixtapeMirrors = checkIfMixtapeMirror(orderedArr);
        setMixtapeMirror(mixtapeMirrors);
        setPaginatedResults(authPub.data.explorePublications.pageInfo);
        const response = await checkPostReactions(orderedArr);
        setHasReacted(response?.hasReactedArr);
        setReactionsFeed(response?.reactionsFeedArr);
        const hasMirroredArr = await checkIfMirrored(orderedArr);
        setHasMirrored(hasMirroredArr);
        const hasCommentedArr = await checkIfCommented(orderedArr);
        setHasCommented(hasCommentedArr);
      } else {
        const orderedArr = orderFeedManual(filteredArr);
        setPublicationsFeed(orderedArr);
        const mixtapeMirrors = checkIfMixtapeMirror(orderedArr);
        setMixtapeMirror(mixtapeMirrors);
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
      const response = await checkPostReactions(filteredArr);
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
        console.log(authPub.data.explorePublications.pageInfo, "second data")
        const orderedArr = orderFeedManual(filteredArrAuth);
        const mixtapeMirrors = checkIfMixtapeMirror(orderedArr);
        setMixtapeMirror([...mixtapeMirror, ...mixtapeMirrors]);
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
        const orderedArr = orderFeedManual(filteredArr);
        const mixtapeMirrors = checkIfMixtapeMirror(orderedArr);
        setMixtapeMirror([...mixtapeMirror, ...mixtapeMirrors]);
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
      const orderedArr = orderFeedManual(filteredArr);
      const mixtapeMirrors = checkIfMixtapeMirror(orderedArr);
      setMixtapeMirror([...mixtapeMirror, ...mixtapeMirrors]);
      setPublicationsFeed([...publicationsFeed, ...orderedArr]);
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

  const handleHidePost = async (id: string): Promise<void> => {
    console.log(id);
    try {
      const hidden = await hidePublication({
        publicationId: id,
      });
      if (hidden) {
        dispatch(
          setIndexModal({
            actionValue: true,
            actionMessage: "Post Successfully Hidden",
          })
        );
      }
    } catch (err: any) {
      dispatch(
        setIndexModal({
          actionValue: true,
          actionMessage: "Hide Unsuccessful, Please Try Again",
        })
      );
      console.error(err?.message);
    }
    setTimeout(() => {
      dispatch(
        setIndexModal({
          actionValue: false,
          actionMessage: undefined,
        })
      );
    }, 3000);
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
    checkPostReactions,
    checkIfCommented,
    checkIfMirrored,
    mixtapeMirror,
    handleHidePost,
  };
};

export default useMainFeed;
