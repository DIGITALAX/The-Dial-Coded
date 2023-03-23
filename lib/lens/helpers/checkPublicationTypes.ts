const checkPublicationTypes = (
  feedOrderState: string | undefined,
  feedPriorityState: string | undefined
): string[] => {
  let feedOrder: string[];
  if (!feedOrderState && !feedPriorityState) {
    feedOrder = ["POST"];
  } else {
    if (feedPriorityState === "reactions") {
      if (feedOrderState === "algo") {
        feedOrder = ["COMMENT", "MIRROR"];
      } else {
        feedOrder = ["COMMENT"];
      }
    } else {
      if (feedOrderState === "chrono") {
        feedOrder = ["POST"];
      } else {
        feedOrder = ["POST", "COMMENT", "MIRROR"];
      }
    }
  }
  return feedOrder;
};

export default checkPublicationTypes;
