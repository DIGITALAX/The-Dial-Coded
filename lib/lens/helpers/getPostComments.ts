import {
  whoCommentedPublications,
  whoCommentedPublicationsAuth,
} from "../../../graphql/queries/profilePublication";
import checkIfCommented from "./checkIfCommented";
import checkIfMirrored from "./checkIfMirrored";
import checkPostReactions from "./checkPostReactions";

const getPostComments = async (
  setLoading: (e: boolean) => void,
  setCommentors: (e: any[]) => void,
  setPaginated: (e: any) => void,
  setReactionsFeed: (e: any[]) => void,
  profile: string | undefined,
  setHasMirrored: (e: boolean[]) => void,
  setHasCommented: (e: boolean[]) => void,
  setHasReacted: (e: boolean[]) => void,
  setReactionLoaded: (e: boolean[]) => void,
  id?: string,
  commentId?: string
): Promise<void> => {
  setLoading(true);
  try {
    let comments: any;

    if (profile) {
      comments = await whoCommentedPublicationsAuth({
        commentsOf: id ? id : commentId,
        limit: 30,
      });
    } else {
      comments = await whoCommentedPublications({
        commentsOf: id ? id : commentId,
        limit: 30,
      });
    }
    const arr: any[] = [...comments.data.publications.items];
    const sortedArr = arr.sort(
      (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
    );
    setCommentors(sortedArr);
    setPaginated(comments.data.publications.pageInfo);
    const response = await checkPostReactions(sortedArr, profile);
    setReactionsFeed(response?.reactionsFeedArr);
    setReactionLoaded(Array(sortedArr?.length).fill(true));
    if (profile) {
      const hasMirroredArr = await checkIfMirrored(sortedArr, profile);
      setHasMirrored(hasMirroredArr);
      const hasCommentedArr = await checkIfCommented(sortedArr, profile);
      setHasCommented(hasCommentedArr);
      setHasReacted(response?.hasReactedArr);
    }
  } catch (err: any) {
    console.error(err.message);
  }
  setLoading(false);
};

export default getPostComments;
