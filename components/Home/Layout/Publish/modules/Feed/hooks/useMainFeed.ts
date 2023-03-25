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
  whoCommentedPublicationsAuth,
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
import checkIfFollowerOnly from "../../../../../../../lib/lens/helpers/checkIfFollowerOnly";
import checkFeedTypes from "../../../../../../../lib/lens/helpers/checkFeedTypes";
import {
  getScrollPosition,
  setScrollPosition,
} from "../../../../../../../lib/lens/utils";
import { scrollToPosition } from "../../../../../../../lib/lens/helpers/scrollToPosition";

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
  const feedTypeState = useSelector(
    (state: RootState) => state.app.feedTypeReducer?.value
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
    (state: RootState) => state.app.publicationReducer?.open
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
  const [reactionLoaded, setReactionLoaded] = useState<boolean[]>([]);
  const [hasReacted, setHasReacted] = useState<boolean[]>([]);
  const [hasMirrored, setHasMirrored] = useState<boolean[]>([]);
  const [hasCommented, setHasCommented] = useState<boolean[]>([]);
  const [commentInfoLoading, setCommentInfoLoading] = useState<boolean>(false);
  const [followerOnly, setFollowerOnly] = useState<boolean[]>([]);
  const [mixtapeMirror, setMixtapeMirror] = useState<boolean[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [publicationsLoading, setPublicationsLoading] =
    useState<boolean>(false);
  const [firstPubLoad, setFirstPubLoad] = useState<boolean>(true);

  const fetchPublications = async (profileExists?: boolean): Promise<void> => {
    setPublicationsLoading(true);
    const feedOrder = checkPublicationTypes(feedOrderState, feedPriorityState);
    const feedType = checkFeedTypes(
      feedTypeState as string,
      feedPriorityState as string
    );
    try {
      let publicationsList;
      if (profileExists) {
        publicationsList = await explorePublicationsAuth({
          sources: "thedial",
          publicationTypes: feedOrder,
          limit: 20,
          sortCriteria: "LATEST",
          noRandomize: true,
          metadata: feedType,
        });
      } else {
        publicationsList = await explorePublications({
          sources: "thedial",
          publicationTypes: feedOrder,
          limit: 20,
          sortCriteria: "LATEST",
          noRandomize: true,
          metadata: feedType,
        });
      }
      if (
        !publicationsList ||
        publicationsList?.data.explorePublications.items.length < 20
      ) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
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
      if (profileExists) {
        const isOnlyFollowers = await checkIfFollowerOnly(
          filteredArr,
          lensProfile
        );
        setFollowerOnly(isOnlyFollowers as boolean[]);
      } else {
        const isOnlyFollowers = await checkIfFollowerOnly(
          filteredArr,
          undefined
        );
        setFollowerOnly(isOnlyFollowers as boolean[]);
      }
      console.log({ filteredArr });
      if (firstPubLoad) {
        const postStorage = getScrollPosition();
        if (postStorage) {
          scrollToPosition(filteredArr, postStorage, fetchMorePublications);
        }
      }
      setPublicationsLoading(false);
      setFirstPubLoad(false);
      setPaginatedResults(publicationsList?.data?.explorePublications.pageInfo);
      const mixtapeMirrors = checkIfMixtapeMirror(filteredArr);
      setMixtapeMirror(mixtapeMirrors);
      const response = await checkPostReactions(filteredArr, lensProfile);
      setReactionsFeed(response?.reactionsFeedArr);
      setReactionLoaded(Array(filteredArr?.length).fill(true));
      if (lensProfile) {
        setHasMirrored(mixtapeMirrors);
        const hasCommentedArr = await checkIfCommented(
          filteredArr,
          lensProfile
        );
        setHasCommented(hasCommentedArr);
        setHasReacted(response?.hasReactedArr);
      }
    } catch (err: any) {
      dispatch(setNoUserData(true));
      console.error(err);
    }
  };

  const getUserSelectFeed = async (): Promise<void> => {
    setPublicationsLoading(true);
    const feedOrder = checkPublicationTypes(feedOrderState, feedPriorityState);
    const feedType = checkFeedTypes(
      feedTypeState as string,
      feedPriorityState as string
    );
    let sortedArr: any[];
    let pageData: any;
    try {
      if (!lensProfile) {
        const { data } = await profilePublications({
          sources: "thedial",
          profileId: (userView as any)?.profileId,
          publicationTypes: feedOrder,
          limit: 20,
          metadata: feedType,
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
          metadata: feedType,
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
      if (!sortedArr || sortedArr?.length < 20) {
        setHasMore(false);
      } else {
        setHasMore(true);
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
      setPublicationsLoading(false);
      setFirstPubLoad(false);
      const mixtapeMirrors = checkIfMixtapeMirror(orderedArr);
      setMixtapeMirror(mixtapeMirrors);
      setPaginatedResults(pageData);
      const response = await checkPostReactions(orderedArr, lensProfile);
      setReactionsFeed(response?.reactionsFeedArr);
      setReactionLoaded(Array(orderedArr?.length).fill(true));
      const isOnlyFollowers = await checkIfFollowerOnly(
        orderedArr,
        lensProfile
      );
      setFollowerOnly(isOnlyFollowers as boolean[]);
      if (lensProfile) {
        const hasMirroredArr = await checkIfMirrored(orderedArr, lensProfile);
        setHasMirrored(hasMirroredArr);
        const hasCommentedArr = await checkIfCommented(orderedArr, lensProfile);
        setHasCommented(hasCommentedArr);
        setHasReacted(response?.hasReactedArr);
      }
    } catch (err: any) {
      dispatch(setNoUserData(true));
      console.error(err.message);
    }
  };

  const getFeedTimeline = async (): Promise<void> => {
    setPublicationsLoading(true);
    try {
      const res = await feedTimeline({
        sources: "thedial",
        profileId: lensProfile,
        limit: 50,
      });

      if (!res || res?.data?.feed?.items?.length < 50) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
      const arr: any[] = [...res?.data.feed.items];
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
      if (!filteredArr || filteredArr.length > 1) {
        const orderedArr = orderFeedManual(
          filteredArr,
          feedOrderState,
          feedPriorityState
        );

        setPublicationsFeed(orderedArr);
        setPublicationsLoading(false);
        setFirstPubLoad(false);
        const isOnlyFollowers = await checkIfFollowerOnly(
          orderedArr,
          lensProfile
        );
        setFollowerOnly(isOnlyFollowers as boolean[]);
        const mixtapeMirrors = checkIfMixtapeMirror(orderedArr);
        setMixtapeMirror(mixtapeMirrors);
        setPaginatedResults(res?.data.feed.pageInfo);
        const response = await checkPostReactions(orderedArr, lensProfile);
        setHasReacted(response?.hasReactedArr);
        setReactionsFeed(response?.reactionsFeedArr);
        setReactionLoaded(Array(orderedArr?.length).fill(true));
        const hasMirroredArr = await checkIfMirrored(orderedArr, lensProfile);
        setHasMirrored(hasMirroredArr);
        const hasCommentedArr = await checkIfCommented(orderedArr, lensProfile);
        setHasCommented(hasCommentedArr);
      } else {
        await fetchPublications();
      }
    } catch (err: any) {
      await fetchPublications();
      console.error(err.message);
    }
    setPublicationsLoading(false);
  };

  // fetch more
  const fetchMorePublications = async (): Promise<any[] | void> => {
    const feedOrder = checkPublicationTypes(feedOrderState, feedPriorityState);
    const feedType = checkFeedTypes(
      feedTypeState as string,
      feedPriorityState as string
    );
    try {
      if (!paginatedResults?.next) {
        // fix apollo duplications on null next
        setHasMore(false);
        return;
      }
      setHasMore(true);
      const morePublications = await explorePublications({
        sources: "thedial",
        publicationTypes: feedOrder,
        limit: 30,
        sortCriteria: "LATEST",
        noRandomize: true,
        cursor: paginatedResults?.next,
        metadata: feedType,
      });
      const arr: PublicationSearchResult[] = [
        ...morePublications?.data.explorePublications.items,
      ];
      const sortedArr: any[] = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      if (sortedArr?.length < 30) {
        setHasMore(false);
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
      setPublicationsFeed([...publicationsFeed, ...filteredArr]);
      setPaginatedResults(morePublications?.data.explorePublications.pageInfo);
      const isOnlyFollowers = await checkIfFollowerOnly(filteredArr, undefined);
      setFollowerOnly([...followerOnly, ...(isOnlyFollowers as boolean[])]);
      const mixtapeMirrors = checkIfMixtapeMirror(filteredArr);
      setMixtapeMirror([...mixtapeMirror, ...mixtapeMirrors]);

      let reactionsResponse: any[];
      let hasReactedResponse: boolean[];
      if (reactionsFeed?.length !== publicationsFeed?.length) {
        const { hasReactedArr, reactionsFeedArr } = await checkPostReactions(
          [
            ...publicationsFeed?.slice(
              -(publicationsFeed?.length - reactionsFeed?.length)
            ),
            ...filteredArr,
          ],
          lensProfile
        );
        reactionsResponse = reactionsFeedArr;
        hasReactedResponse = hasReactedArr;
      } else {
        const { hasReactedArr, reactionsFeedArr } = await checkPostReactions(
          filteredArr,
          lensProfile
        );
        reactionsResponse = reactionsFeedArr;
        hasReactedResponse = hasReactedArr;
      }
      setReactionsFeed([...reactionsFeed, ...reactionsResponse]);
      setHasReacted([...hasReacted, ...(hasReactedResponse as boolean[])]);
      setReactionLoaded((prevReactionsLoaded) => [
        ...prevReactionsLoaded,
        ...Array(filteredArr?.length).fill(true),
      ]);
      return [...publicationsFeed, ...filteredArr];
    } catch (err: any) {
      console.error(err);
    }
  };

  const getMoreFeedTimeline = async (): Promise<void> => {
    try {
      if (!paginatedResults?.next) {
        // fix apollo duplications on null next
        setHasMore(false);
        return;
      }
      setHasMore(true);
      const morePublications = await feedTimeline({
        profileId: lensProfile,
        limit: 50,
        cursor: paginatedResults?.next,
        // metadata: feedType
      });
      const arr: PublicationSearchResult[] = [
        ...morePublications?.data.feed.items,
      ];
      const sortedArr: any[] = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      if (sortedArr?.length < 50) {
        setHasMore(false);
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
      if (filteredArr.length > 1) {
        const orderedArr = orderFeedManual(
          filteredArr,
          feedOrderState,
          feedPriorityState
        );

        if (orderedArr.length > 1) {
          const isOnlyFollowers = await checkIfFollowerOnly(
            orderedArr,
            lensProfile
          );
          setFollowerOnly([...followerOnly, ...(isOnlyFollowers as boolean[])]);
          const mixtapeMirrors = checkIfMixtapeMirror(orderedArr);
          setMixtapeMirror([...mixtapeMirror, ...mixtapeMirrors]);
          setPublicationsFeed([...publicationsFeed, ...orderedArr]);
          setPaginatedResults(morePublications?.data.feed.pageInfo);

          let reactionsResponse: any[];
          let hasReactedResponse: boolean[];
          if (reactionsFeed?.length !== publicationsFeed?.length) {
            const { hasReactedArr, reactionsFeedArr } =
              await checkPostReactions(
                [
                  ...publicationsFeed?.slice(
                    -(publicationsFeed?.length - reactionsFeed?.length)
                  ),
                  ...orderedArr,
                ],
                lensProfile
              );
            reactionsResponse = reactionsFeedArr;
            hasReactedResponse = hasReactedArr;
          } else {
            const { hasReactedArr, reactionsFeedArr } =
              await checkPostReactions(orderedArr, lensProfile);
            reactionsResponse = reactionsFeedArr;
            hasReactedResponse = hasReactedArr;
          }
          setReactionsFeed([...reactionsFeed, ...reactionsResponse]);
          setHasReacted([...hasReacted, ...(hasReactedResponse as boolean[])]);
          setReactionLoaded((prevReactionsLoaded) => [
            ...prevReactionsLoaded,
            ...Array(orderedArr?.length).fill(true),
          ]);

          const hasMirroredArr = await checkIfMirrored(orderedArr, lensProfile);
          setHasMirrored([...hasMirrored, ...hasMirroredArr]);
          const hasCommentedArr = await checkIfCommented(
            orderedArr,
            lensProfile
          );
          setHasCommented([...hasCommented, ...hasCommentedArr]);
        }
      } else {
        await fetchMorePublications();
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getMoreUserSelectFeed = async (): Promise<void> => {
    const feedOrder = checkPublicationTypes(feedOrderState, feedPriorityState);
    const feedType = checkFeedTypes(
      feedTypeState as string,
      feedPriorityState as string
    );
    let sortedArr: any[];
    let pageData: any;
    try {
      if (!paginatedResults?.next) {
        setHasMore(false);
        // fix apollo duplications on null next
        return;
      }
      setHasMore(true);
      if (!lensProfile) {
        const { data } = await profilePublications({
          sources: "thedial",
          profileId: (userView as any)?.profileId,
          publicationTypes: feedOrder,
          limit: 20,
          cursor: paginatedResults?.next,
          metadata: feedType,
        });
        const arr: any[] = [...data?.publications?.items];
        sortedArr = arr.sort(
          (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
        );
        if (sortedArr?.length < 20) {
          setHasMore(false);
        }
        pageData = data?.publications?.pageInfo;
      } else {
        const { data } = await profilePublicationsAuth({
          sources: "thedial",
          profileId: (userView as any)?.profileId,
          publicationTypes: feedOrder,
          limit: 20,
          cursor: paginatedResults?.next,
          metadata: feedType,
        });
        const arr: any[] = [...data?.publications?.items];
        sortedArr = arr.sort(
          (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
        );
        if (sortedArr?.length < 20) {
          setHasMore(false);
        }
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
      const isOnlyFollowers = await checkIfFollowerOnly(
        orderedArr,
        lensProfile
      );
      setFollowerOnly([...followerOnly, ...(isOnlyFollowers as boolean[])]);
      const mixtapeMirrors = checkIfMixtapeMirror(orderedArr);
      setMixtapeMirror([...mixtapeMirror, ...mixtapeMirrors]);
      setPublicationsFeed([...publicationsFeed, ...orderedArr]);
      setPaginatedResults(pageData);

      let reactionsResponse: any[];
      let hasReactedResponse: boolean[];
      if (reactionsFeed?.length !== publicationsFeed?.length) {
        const { hasReactedArr, reactionsFeedArr } = await checkPostReactions(
          [
            ...publicationsFeed?.slice(
              -(publicationsFeed?.length - reactionsFeed?.length)
            ),
            ...orderedArr,
          ],
          lensProfile
        );
        reactionsResponse = reactionsFeedArr;
        hasReactedResponse = hasReactedArr;
      } else {
        const { hasReactedArr, reactionsFeedArr } = await checkPostReactions(
          orderedArr,
          lensProfile
        );
        reactionsResponse = reactionsFeedArr;
        hasReactedResponse = hasReactedArr;
      }
      setReactionsFeed([...reactionsFeed, ...reactionsResponse]);
      setReactionLoaded((prevReactionsLoaded) => [
        ...prevReactionsLoaded,
        ...Array(orderedArr?.length).fill(true),
      ]);

      if (lensProfile) {
        const hasMirroredArr = await checkIfMirrored(orderedArr, lensProfile);
        setHasMirrored([...hasMirrored, ...hasMirroredArr]);
        const hasCommentedArr = await checkIfCommented(orderedArr, lensProfile);
        setHasCommented([...hasCommented, ...hasCommentedArr]);
        setHasReacted([...hasReacted, ...(hasReactedResponse as boolean[])]);
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
      if (!commentPageInfo?.next) {
        // fix apollo duplications on null next
        return;
      }
      let comments: any;
      if (lensProfile) {
        comments = await whoCommentedPublicationsAuth({
          commentsOf: id ? id : commentId,
          limit: 30,
          cursor: commentPageInfo?.next,
        });
      } else {
        comments = await whoCommentedPublications({
          commentsOf: id ? id : commentId,
          limit: 30,
          cursor: commentPageInfo?.next,
        });
      }
      const arr: any[] = [...comments.data.publications.items];
      const sortedArr = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      setCommentors([...commentors, ...sortedArr]);
      setCommentPageInfo(comments.data.publications.pageInfo);

      let reactionsResponse: any[];
      let hasReactedResponse: boolean[];
      if (reactionsFeed?.length !== publicationsFeed?.length) {
        const { hasReactedArr, reactionsFeedArr } = await checkPostReactions(
          [
            ...publicationsFeed?.slice(
              -(publicationsFeed?.length - reactionsFeed?.length)
            ),
            ...sortedArr,
          ],
          lensProfile
        );
        reactionsResponse = reactionsFeedArr;
        hasReactedResponse = hasReactedArr;
      } else {
        const { hasReactedArr, reactionsFeedArr } = await checkPostReactions(
          sortedArr,
          lensProfile
        );
        reactionsResponse = reactionsFeedArr;
        hasReactedResponse = hasReactedArr;
      }
      setReactionsFeed([...reactionsFeed, ...reactionsResponse]);
      setReactionLoaded((prevReactionsLoaded) => [
        ...prevReactionsLoaded,
        ...Array(sortedArr?.length).fill(true),
      ]);

      if (lensProfile) {
        const hasMirroredArr = await checkIfMirrored(sortedArr, lensProfile);
        setHasMirrored([...hasMirrored, ...hasMirroredArr]);
        const hasCommentedArr = await checkIfCommented(sortedArr, lensProfile);
        setHasCommented([...hasCommented, ...hasCommentedArr]);
        setHasReacted([...hasReacted, ...hasReactedResponse]);
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
        setReactionLoaded,
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
    if (
      !router.asPath.includes("/post/") &&
      !router.asPath.includes("/mixtape/")
    ) {
      if (userView?.handle) {
        getUserSelectFeed();
      } else {
        if (!lensProfile) {
          fetchPublications();
        } else {
          getFeedTimeline();
        }
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
    feedTypeState,
    commentShow,
    indexerModal.message,
    indexerModal.value,
    hearted,
    router.asPath,
  ]);

  const onFeedScroll = () => {
    const scrollableDivRef = document.getElementsByClassName(
      "relative row-start-1 w-full h-full"
    );
    const postElements = document.querySelectorAll("[data-post-id]");
    for (let i = postElements.length - 1; i >= 0; i--) {
      const postElement = postElements[i];
      const postElementBounds = postElement.getBoundingClientRect();
      const scrollableDivBounds = scrollableDivRef[4].getBoundingClientRect();
      if (
        postElementBounds.top <= scrollableDivBounds.top + 50 &&
        postElementBounds.bottom >= scrollableDivBounds.top
      ) {
        const postId = (postElement as any).dataset.postId;
        setScrollPosition(String(postId));
        break;
      }
    }
  };

  return {
    publicationsFeed,
    fetchMoreFeed,
    hasReacted,
    reactionsFeed,
    reactionLoaded,
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
    followerOnly,
    publicationsLoading,
    firstPubLoad,
    hasMore,
    setReactionLoaded,
    onFeedScroll,
  };
};

export default useMainFeed;
