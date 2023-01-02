import { whoCommentedPublications } from "../../../graphql/queries/profilePublication";

const checkIfMoreCommented = async (
  pageData: any,
  id: string
): Promise<any> => {
  try {
    const comments = await whoCommentedPublications({
      commentsOf: id,
      limit: 30,
      cursor: pageData?.next,
    });
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
