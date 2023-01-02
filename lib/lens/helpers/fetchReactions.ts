import whoReactedublications from "../../../graphql/queries/whoReactedPublication";
import lodash from "lodash";

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

export default fetchReactions;
