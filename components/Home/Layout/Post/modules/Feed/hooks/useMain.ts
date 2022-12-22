import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import explorePublications from "../../../../../../../graphql/queries/explorePublications";
import whoReactedublications from "../../../../../../../graphql/queries/whoReactedPublication";
import { RootState } from "../../../../../../../redux/store";
import {
  ApprovedAllowanceAmount,
  PaginatedResultInfo,
  PublicationsQueryRequest,
} from "../../../../../../Common/types/lens.types";
import { UseMainResults } from "../types/feed.types";
import lodash from "lodash";
import getPublication from "../../../../../../../graphql/queries/getPublication";
import { setPostCollectValues } from "../../../../../../../redux/reducers/postCollectValuesSlice";
import approvedModuleAllowance from "../../../../../../../graphql/queries/approvedModuleAllowance";
import approvedData from "../../../../../../../graphql/queries/approveData";
import { setApprovalArgs } from "../../../../../../../redux/reducers/approvalArgsSlice";
import feedTimeline from "../../../../../../../graphql/queries/feedTimeline";
import exploreAuthPublications from "../../../../../../../graphql/queries/exploreAuth";
import profilePublications from "../../../../../../../graphql/queries/profilePublication";

const useMain = (): UseMainResults => {
  const [feedType, setFeedType] = useState<string[]>(["POST"]);
  const [sortCriteria, setSortCriteria] = useState<string>("LATEST");
  const [didMirror, setDidMirror] = useState<any[]>([]);
  const [mirrorPaginated, setMirrorPaginated] = useState<any>();
  const dispatch = useDispatch();
  const publicationModal = useSelector(
    (state: RootState) => state.app.publicationReducer.value
  );
  const reactionsModal = useSelector(
    (state: RootState) => state.app.reactionStateReducer
  );
  const layout = useSelector(
    (state: RootState) => state.app.layoutReducer.value
  );
  const feedOrderState = useSelector(
    (state: RootState) => state.app.feedOrderReducer.value
  );
  const feedPriorityState = useSelector(
    (state: RootState) => state.app.feedPriorityReducer.value
  );
  const userView = useSelector(
    (state: RootState) => state.app.userViewerReducer.value
  );
  const isConnected = useSelector(
    (state: RootState) => state.app.walletConnectedReducer.value
  );
  const lensProfile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.id
  );
  const commentsModal = useSelector(
    (state: RootState) => state.app.commentShowReducer.open
  );
  const [publicationsFeed, setPublicationsFeed] = useState<
    PublicationsQueryRequest[]
  >([]);
  const [collectInfoLoading, setCollectInfoLoading] = useState<boolean>(false);
  const [paginatedResults, setPaginatedResults] =
    useState<PaginatedResultInfo>();
  const fetchPublications = async (): Promise<void> => {
    let feedOrder: string[];
    if (!feedOrderState && !feedPriorityState) {
      feedOrder = feedType;
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
    try {
      const publicationsList = await explorePublications({
        sources: "thedial",
        publicationTypes: feedOrder,
        limit: 20,
        sortCriteria: sortCriteria,
        noRandomize: true,
      });
      const arr: any[] = [...publicationsList?.data.explorePublications.items];
      const sortedArr: any[] = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      setPublicationsFeed(sortedArr);
      setPaginatedResults(publicationsList?.data.explorePublications.pageInfo);
    } catch (err: any) {
      console.error(err);
    }
  };

  const fetchMorePublications = async (): Promise<void> => {
    let feedOrder: string[];
    if (!feedOrderState && !feedPriorityState) {
      feedOrder = feedType;
    } else {
      if (!feedPriorityState) {
        if (feedOrderState === "chrono") {
          feedOrder = ["POST"];
        } else {
          feedOrder = ["POST", "COMMENT", "MIRROR"];
        }
      } else {
        if (feedOrderState === "chrono" && feedPriorityState === "reactions") {
          feedOrder = ["COMMENT", "MIRROR"];
        } else {
          feedOrder = ["COMMENT"];
        }
      }
    }
    try {
      const morePublications = await explorePublications({
        sources: "thedial",
        publicationTypes: feedOrder,
        limit: 20,
        sortCriteria: sortCriteria,
        paginatedResults: paginatedResults?.next,
      });
      const arr: PublicationsQueryRequest[] = [
        ...morePublications?.data.explorePublications.items,
      ];
      const sortedArr: PublicationsQueryRequest[] = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      setPublicationsFeed([...publicationsFeed, ...sortedArr]);
      setPaginatedResults(morePublications?.data.explorePublications.pageInfo);
    } catch (err: any) {
      console.error(err);
    }
  };

  const checkApproved = async (
    currencyAddress: string,
    collectModule: string,
    followModule: string | null,
    referenceModule: string | null,
    value: string
  ): Promise<ApprovedAllowanceAmount | void> => {
    if (!currencyAddress || !isConnected || !lensProfile) {
      return;
    }
    try {
      const response = await approvedModuleAllowance({
        currencies: [currencyAddress],
        collectModules: [collectModule],
        followModules: followModule ? [followModule] : [],
        referenceModules: referenceModule ? [referenceModule] : [],
      });
      const approvalArgs = await approvedData({
        currency: currencyAddress,
        value: value,
        collectModule: collectModule,
      });
      dispatch(
        setApprovalArgs(approvalArgs?.data?.generateModuleCurrencyApprovalData)
      );
      return response?.data?.approvedModuleAllowanceAmount[0];
    } catch (err: any) {
      console.error(err.message);
    }
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

  const getMirrors = async () => {
    try {
      const { data } = await profilePublications({
        profileId: lensProfile,
        publicationTypes: ["MIRROR"],
        limit: 50,
      });
      const arr = [...data.publications.items];
      const sortedArr = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      setDidMirror(sortedArr);
      setMirrorPaginated(data?.publications?.pageInfo);
    } catch (err: any) {
      console.error(err);
    }
  };

  const getMoreMirrors = async () => {
    try {
      const { data } = await profilePublications({
        profileId: lensProfile,
        publicationTypes: ["MIRROR"],
        limit: 50,
        cursor: mirrorPaginated?.next,
      });
      const arr = [...data.publications.items];
      const sortedArr = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      setDidMirror([...didMirror, ...sortedArr]);
      setMirrorPaginated(data?.publications?.pageInfo);
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleCoinUSDConversion = async (
    currency: string,
    amount: string
  ): Promise<number | void> => {
    if (!amount) {
      return;
    }
    try {
      const response = await fetch("/api/coin", {
        method: "POST",
        body: currency?.toLowerCase(),
      });
      const json = await response.json();
      const usdValue = lodash.find(json.data, "usd");
      const convertedValue = Number(amount) * usdValue.usd;
      return convertedValue;
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getCollectInfo = async (): Promise<void> => {
    setCollectInfoLoading(true);
    try {
      const { data } = await getPublication({
        publicationId: reactionsModal.value,
      });
      const collectModule = data?.publication?.collectModule;
      const convertedValue = await handleCoinUSDConversion(
        collectModule?.amount?.asset?.symbol,
        collectModule?.amount?.value
      );
      const approvalData: ApprovedAllowanceAmount | void = await checkApproved(
        collectModule?.amount?.asset?.address,
        collectModule?.type,
        null,
        null,
        collectModule?.amount?.value
      );
      const isApproved = parseInt(approvalData?.allowance as string, 16);
      dispatch(
        setPostCollectValues({
          actionType: collectModule?.type,
          actionLimit: collectModule?.collectLimit,
          actionRecipient: collectModule?.recipient,
          actionReferralFee: collectModule?.referralFee,
          actionEndTime: collectModule?.endTimestamp,
          actionValue: collectModule?.value,
          actionFollowerOnly: collectModule?.followerOnly,
          actionAmount: {
            asset: {
              address: collectModule?.amount?.asset?.address,
              decimals: collectModule?.amount?.asset?.decimals,
              name: collectModule?.amount?.asset?.name,
              symbol: collectModule?.amount?.asset?.symbol,
            },
            value: collectModule?.amount?.value,
          },
          actionUSD: convertedValue ? convertedValue : null,
          actionCanCollect: data?.publication?.hasCollectedByMe,
          actionApproved:
            collectModule?.type === "FreeCollectModule" ||
            isApproved > collectModule?.amount?.value
              ? true
              : false,
          actionTotalCollects: data?.publication?.stats?.totalAmountOfCollects,
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setCollectInfoLoading(false);
  };

  const getFeedTimeline = async (): Promise<void> => {
    try {
      const publicationsList = await feedTimeline({
        profileId: lensProfile,
        limit: 50,
      });
      const arr: any[] = [...publicationsList?.data.feed.items];
      const sortedArr: any[] = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      setPublicationsFeed(sortedArr);
      setPaginatedResults(publicationsList?.data.feed.pageInfo);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getMoreFeedTimeline = async (): Promise<void> => {
    try {
      const morePublications = await feedTimeline({
        profileId: lensProfile,
        limit: 50,
        cursor: paginatedResults?.next,
      });
      const arr: PublicationsQueryRequest[] = [
        ...morePublications?.data.feed.items,
      ];
      const sortedArr: PublicationsQueryRequest[] = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      setPublicationsFeed([...publicationsFeed, ...sortedArr]);
      setPaginatedResults(morePublications?.data.feed.pageInfo);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (lensProfile) {
      fetchPublications();
      getMirrors();
      // getFeedTimeline();
    } else {
      fetchPublications();
    }

    if (reactionsModal.type === "heart") {
      fetchReactions(reactionsModal.value);
    }
    if (reactionsModal.type === "collect") {
      getCollectInfo();
    }
  }, [
    publicationModal,
    commentsModal,
    reactionsModal.open,
    reactionsModal.type,
    feedOrderState,
    feedPriorityState,
    lensProfile,
    isConnected,
    layout,
  ]);

  return {
    setFeedType,
    setSortCriteria,
    fetchMorePublications,
    publicationsFeed,
    fetchReactions,
    getMoreFeedTimeline,
    collectInfoLoading,
    didMirror,
    getMoreMirrors,
    getMirrors,
  };
};

export default useMain;
