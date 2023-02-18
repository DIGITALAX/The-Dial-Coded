import lodash from "lodash";
import fetchReactions from "./fetchReactions";

const checkPostReactions = async (
  arr: any[],
  lensProfile: string | undefined
): Promise<any> => {
  let reactionsFeedArr: any[] = [];
  let hasReactedArr: any[] = [];
  try {
    for (let pub = 0; pub < arr?.length; pub++) {
      const reactions = await fetchReactions(arr[pub]?.id);
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
