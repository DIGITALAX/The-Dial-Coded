const checkFeedTypes = (
  feedTypeState: string
): {
  tags: {
    oneOf: string[];
  };
} => {
  let metadata: {
    tags: {
      oneOf: string[];
    };
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

  return metadata;
};

export default checkFeedTypes;
