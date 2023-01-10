const checkPublicationTypes = (
  feedOrderState: string | undefined,
  feedPriorityState: string | undefined,
): string[] => {
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

export default checkPublicationTypes;
