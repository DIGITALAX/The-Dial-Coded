const checkFeedTypes = (
  feedTypeState: string,
  feedPriorityState: string
): {
  tags: {
    oneOf: string[];
  };
  mainContentFocus?: string[];
} => {
  let metadata: {
    tags: {
      oneOf: string[];
    };
    mainContentFocus?: string[];
  } = {
    tags: {
      oneOf: [""],
    },
  };
  if (feedTypeState === "canvas") {
    metadata = {
      tags: {
        oneOf: ["dialCanvasDraft"],
      },
    };
  }

  if (feedPriorityState === "images") {
    metadata = {
      mainContentFocus: ["IMAGE"],
      ...metadata,
    };
  } else if (feedPriorityState === "video") {
    metadata = {
      mainContentFocus: ["VIDEO"],
      ...metadata,
    };
  } else if (feedPriorityState === "text") {
    metadata = {
      mainContentFocus: ["TEXT_ONLY"],
      ...metadata,
    };
  }

  return metadata;
};

export default checkFeedTypes;
