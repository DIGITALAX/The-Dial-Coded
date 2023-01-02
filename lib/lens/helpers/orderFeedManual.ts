import lodash from "lodash";
import { PublicationSearchResult } from "../../../components/Common/types/lens.types";

const orderFeedManual = (
  arr: PublicationSearchResult[],
  feedOrderState: string | undefined,
  feedPriorityState: string | undefined
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

export default orderFeedManual;
