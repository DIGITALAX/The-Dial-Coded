import whoReactedublications from "../../../graphql/queries/whoReactedPublication";
import lodash from "lodash";

export const fetchReactions = async (pubId: string): Promise<any> => {
  try {
    const reactions = await whoReactedublications({
      publicationId: pubId,
      limit: 50,
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

export const fetchMoreReactions = async (pubId: string, page: any): Promise<any> => {
  try {
    const reactions = await whoReactedublications({
      publicationId: pubId,
      limit: 50,
      cursor: page?.next,
    });
    const reactionsValues = lodash.filter(
      reactions?.data?.whoReactedPublication.items,
      (item: any) => item.reaction === "UPVOTE"
    );
    return {
      reactionsValues,
      paginatedData: reactions?.data?.whoReactedPublication?.pageInfo,
    };
  } catch (err: any) {
    console.error(err.message);
  }
}

