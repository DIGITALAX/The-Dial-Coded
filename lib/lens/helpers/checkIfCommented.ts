import lodash from "lodash";
import {
  whoCommentedPublications,
  whoCommentedPublicationsAuth,
} from "../../../graphql/queries/profilePublication";
import checkIfMoreCommented from "./checkIfMoreCommented";

const checkIfCommented = async (
  inputArr: any[],
  lensProfile?: string | undefined
): Promise<any> => {
  let hasCommentedArr: boolean[] = [];
  try {
    for (let i = 0; i < inputArr?.length; i++) {
      let comments: any;
      if (lensProfile) {
        comments = await whoCommentedPublicationsAuth({
          commentsOf: inputArr[i]?.id,
          limit: 50,
          commentsOfOrdering: "RANKING",
          commentsRankingFilter: "RELEVANT",
          sources: ["thedial"]
        });
      } else {
        comments = await whoCommentedPublications({
          commentsOf: inputArr[i]?.id,
          limit: 50,
          commentsOfOrdering: "RANKING",
          commentsRankingFilter: "RELEVANT",
          sources: ["thedial"]
        });
      }

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
          inputArr[i]?.id,
          lensProfile
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
