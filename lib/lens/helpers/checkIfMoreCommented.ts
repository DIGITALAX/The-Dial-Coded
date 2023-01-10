import {
  whoCommentedPublications,
  whoCommentedPublicationsAuth,
} from "../../../graphql/queries/profilePublication";

const checkIfMoreCommented = async (
  pageData: any,
  id: string,
  lensProfile: string | undefined
): Promise<any> => {
  try {
    let comments: any;
    if (lensProfile) {
      comments = await whoCommentedPublicationsAuth({
        commentsOf: id,
        limit: 50,
        cursor: pageData?.next,
      });
    } else {
      comments = await whoCommentedPublications({
        commentsOf: id,
        limit: 50,
        cursor: pageData?.next,
      });
    }

    const arr: any[] = [...comments.data.publications.items];
    const commentedValues: any[] = arr.sort(
      (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
    );
    const paginatedData = comments.data.publications.pageInfo;
    return { commentedValues, paginatedData };
  } catch (err: any) {
    console.error(err.message);
  }
};

export default checkIfMoreCommented;
