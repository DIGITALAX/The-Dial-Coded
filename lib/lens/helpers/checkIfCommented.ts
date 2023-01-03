import lodash from "lodash";
import { whoCommentedPublications } from "../../../graphql/queries/profilePublication";
import checkIfMoreCommented from "./checkIfMoreCommented";

const checkIfCommented = async (
  inputArr: any[],
  lensProfile?: string | undefined
): Promise<any> => {
  let hasCommentedArr: boolean[] = [];
  try {
    for (let i = 0; i < inputArr?.length; i++) {
      const comments = await whoCommentedPublications({
        commentsOf: inputArr[i]?.id,
        limit: 50,
      });
      const arr: any[] = [...comments.data.publications.items];
      const sortedArr: any[] = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      let commentedArray: any[] = sortedArr;
      let loopCommentedArray: any[] = sortedArr;
      let pageData: any;
      while (loopCommentedArray?.length === 50) {
        const { commentedValues, paginatedData } = await checkIfMoreCommented(
          pageData ? pageData : comments?.data?.publications?.pageInfo,
          inputArr[i]?.id
        );
        loopCommentedArray = commentedValues;
        pageData = paginatedData;
        commentedArray = [...commentedArray, ...commentedValues];
      }
      const commentLength = lodash.filter(
        commentedArray,
        (comment) => comment?.profile.id === lensProfile
      );
      if (commentLength?.length > 0) {
        hasCommentedArr.push(true);
      } else {
        hasCommentedArr.push(false);
      }
    }
    return hasCommentedArr;
  } catch (err: any) {
    console.error(err.any);
  }
};

export default checkIfCommented;
