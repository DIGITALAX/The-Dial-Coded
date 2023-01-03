import checkIfCommented from "./checkIfCommented";
import checkIfMirrored from "./checkIfMirrored";
import checkIfMixtapeMirror from "./checkIfMixtapeMirror";
import checkPostReactions from "./checkPostReactions";

const getPublicationReactions = async (
  publicationSearchValues: any[],
  lensProfile: string | undefined
): Promise<any> => {
  let mixtapeMirrors: boolean[] = [];
  let reactionsFeed: any[] = [];
  let hasMirrored: boolean[] = [];
  let hasCommented: boolean[] = [];
  let hasReacted: boolean[] = [];
  try {
    mixtapeMirrors = checkIfMixtapeMirror(publicationSearchValues);
    const response = await checkPostReactions(
      publicationSearchValues,
      lensProfile
    );
    reactionsFeed = response?.reactionsFeedArr;
    if (lensProfile) {
      hasMirrored = await checkIfMirrored(publicationSearchValues, lensProfile);
      hasCommented = await checkIfCommented(
        publicationSearchValues,
        lensProfile
      );
      hasReacted = response?.hasReactedArr;
    }
    return {
      mixtapeMirrors,
      reactionsFeed,
      hasCommented,
      hasMirrored,
      hasReacted,
    };
  } catch (err: any) {
    console.error(err.message);
  }
};

export default getPublicationReactions;
