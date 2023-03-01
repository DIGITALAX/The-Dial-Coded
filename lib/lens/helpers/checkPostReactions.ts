import lodash from "lodash";
import { fetchMoreReactions, fetchReactions } from "./fetchReactions";

const checkPostReactions = async (
  arr: any[],
  lensProfile: string | undefined
): Promise<any> => {
  let reactionsFeedArr: any[] = [];
  let hasReactedArr: any[] = [];
  try {
    for (let pub = 0; pub < arr?.length; pub++) {
      let reactions;
      reactions = await fetchReactions(arr[pub]?.id);
      let reactionsArray: any[] = reactions;
      let loopReactionsArray: any[] = reactions;
      let pageData: any = reactions?.data?.whoReactedPublication?.pageInfo;
      while (loopReactionsArray.length === 50) {
        const { reactionsValues, paginatedData } = await fetchMoreReactions(
          arr[pub]?.id,
          pageData
        );
        loopReactionsArray = reactionsValues;
        pageData = paginatedData;
        reactionsArray = [...reactionsArray, ...reactionsValues];
      }
      reactionsFeedArr.push(reactions.length);
      if (lensProfile) {
        const checkReacted = lodash.filter(
          reactions,
          (arr) => arr?.profile?.id === lensProfile
        );
        hasReactedArr.push(checkReacted.length > 0 ? true : false);
      }
    }
    return { hasReactedArr, reactionsFeedArr };
  } catch (err: any) {
    console.error(err.message);
  }
};

export default checkPostReactions;
