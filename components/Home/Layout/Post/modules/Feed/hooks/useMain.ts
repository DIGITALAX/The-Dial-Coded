import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import explorePublications from "../../../../../../../graphql/queries/explorePublications";
import whoReactedublications from "../../../../../../../graphql/queries/whoReactedPublication";
import { RootState } from "../../../../../../../redux/store";
import {
  PaginatedResultInfo,
  Post,
} from "../../../../../../Common/types/lens.types";
import { UseMainResults } from "../types/feed.types";
import lodash from "lodash";
import getPublication from "../../../../../../../graphql/queries/getPublication";
import { setPostCollectValues } from "../../../../../../../redux/reducers/postCollectValuesSlice";

const useMain = (): UseMainResults => {
  const [feedType, setFeedType] = useState<string[]>(["POST"]);
  const [sortCriteria, setSortCriteria] = useState<string>("LATEST");
  const dispatch = useDispatch();
  const publicationModal = useSelector(
    (state: RootState) => state.app.publicationReducer.value
  );
  const reactionsModal = useSelector(
    (state: RootState) => state.app.reactionStateReducer
  );
  const commentsModal = useSelector(
    (state: RootState) => state.app.commentShowReducer.open
  );
  const [publicationsFeed, setPublicationsFeed] = useState<Post[]>([]);
  const [paginatedResults, setPaginatedResults] =
    useState<PaginatedResultInfo>();
  const fetchPublications = async (): Promise<void> => {
    try {
      const publicationsList = await explorePublications({
        sources: "thedial",
        publicationTypes: feedType,
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
      console.error(err.message);
    }
  };

  const fetchMorePublications = async (): Promise<void> => {
    try {
      const morePublications = await explorePublications({
        sources: "thedial",
        publicationTypes: feedType,
        limit: 20,
        sortCriteria: sortCriteria,
        noRandomize: true,
        cursor: paginatedResults?.next,
      });
      const arr: Post[] = [...morePublications?.data.explorePublications.items];
      const sortedArr: Post[] = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      setPublicationsFeed([...publicationsFeed, ...sortedArr]);
      setPaginatedResults(morePublications?.data.explorePublications.pageInfo);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const fetchReactions = async (pubId: string): Promise<number | void> => {
    try {
      const reactions = await whoReactedublications({
        publicationId: pubId,
      });
      const upvoteArr = lodash.filter(
        reactions?.data?.whoReactedPublication.items,
        (item) => item.reaction === "UPVOTE"
      );
      const reactionArr = upvoteArr?.length;
      return reactionArr;
    } catch (err: any) {
      console.error(err.message);
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
    try {
      const { data } = await getPublication(reactionsModal.value);
      const collectModule = data?.publication?.collectModule;
      const convertedValue = await handleCoinUSDConversion(
        collectModule?.amount?.asset?.symbol,
        collectModule?.amount?.value
      );
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
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchPublications();
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
  ]);

  return {
    setFeedType,
    setSortCriteria,
    fetchMorePublications,
    publicationsFeed,
    fetchReactions,
  };
};

export default useMain;
