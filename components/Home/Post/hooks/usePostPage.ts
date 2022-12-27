import { useState } from "react";
import getPublication from "../../../../graphql/queries/getPublication";
import whoCommentedPublications from "../../../../graphql/queries/whoCommentedPublications";
import lodash from "lodash";
import whoReactedublications from "../../../../graphql/queries/whoReactedPublication";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import {profilePublications} from "../../../../graphql/queries/profilePublication";

const usePostPage = () => {
  const [publicationDataLoading, setPublicationDataLoading] = useState<any>();
  const [publicationData, setPublicationData] = useState<any>();
  const [reactionsPostFeed, setReactionsFeedPost] = useState<any[]>([]);
  const [hasPostCommented, setHasPostCommented] = useState<boolean[]>([]);
  const [hasPostMirrored, setHasPostMirrored] = useState<boolean[]>([]);
  const [hasPostReacted, setHasPostReacted] = useState<boolean[]>([]);
  const lensProfile = useSelector(
    (state: RootState) => state.app.lensProfileReducer?.profile?.id
  );

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

  const checkPostReactions = async (arr: any[]): Promise<any> => {
    let reactionsFeedArr: any[] = [];
    let hasReactedArr: any[] = [];
    try {
      for (let pub = 0; pub < arr?.length; pub++) {
        const reactions = await fetchReactions(arr[pub]?.id);
        reactionsFeedArr.push(reactions.length);
        const checkReacted = lodash.filter(
          reactions,
          (arr) => arr?.profile?.id === lensProfile
        );
        hasReactedArr.push(checkReacted.length > 0 ? true : false);
      }
      return { hasReactedArr, reactionsFeedArr };
    } catch (err: any) {
      console.error(err.message);
    }
  };

  // did mirror
  const checkIfMirrored = async (arr: any[]): Promise<any> => {
    try {
      const { data } = await profilePublications({
        profileId: lensProfile,
        publicationTypes: ["MIRROR"],
        limit: 50,
      });
      const array_data = [...data.publications.items];
      const sortedArr = array_data.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      let mirroredArray: any[] = sortedArr;
      let loopMirroredArray: any[] = sortedArr;
      let pageData: any;
      while (loopMirroredArray.length === 50) {
        const { mirroredValues, paginatedData } = await checkIfMoreMirrored(
          pageData ? pageData : data?.publications?.pageInfo
        );
        loopMirroredArray = mirroredValues;
        pageData = paginatedData;
        mirroredArray = [...mirroredArray, ...mirroredValues];
      }
      let hasMirroredArr: boolean[] = [];
      for (let i = 0; i < arr.length; i++) {
        const mirrorLength = lodash.filter(
          mirroredArray,
          (mirror) => mirror?.mirrorOf?.id === arr[i]?.id
        );
        if (mirrorLength?.length > 0) {
          hasMirroredArr.push(true);
        } else {
          hasMirroredArr.push(false);
        }
      }
      return hasMirroredArr;
    } catch (err: any) {
      console.error(err);
    }
  };

  const checkIfMoreMirrored = async (pageData: any): Promise<any> => {
    try {
      const { data } = await profilePublications({
        profileId: lensProfile,
        publicationTypes: ["MIRROR"],
        limit: 50,
        cursor: pageData?.next,
      });
      const arr = [...data.publications.items];
      const mirroredValues = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      const paginatedData = data?.publications?.pageInfo;
      return { mirroredValues, paginatedData };
    } catch (err: any) {
      console.error(err);
    }
  };

  //did comment
  const checkIfCommented = async (inputArr: any[]): Promise<any> => {
    let hasCommentedArr: boolean[] = [];
    try {
      for (let i = 0; i < inputArr.length; i++) {
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
        while (loopCommentedArray.length === 50) {
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

  const getPublicationData = async (id: string): Promise<void> => {
    setPublicationDataLoading(true);
    try {
      const { data } = await getPublication({
        publicationId: id,
      });
      setPublicationData(data?.publication);
      const response = await checkPostReactions([data?.publication]);

      if (lensProfile) {
        const hasMirroredArr = await checkIfMirrored([data?.publication]);
        setHasPostMirrored(hasMirroredArr);
        const hasCommentedArr = await checkIfCommented([data?.publication]);
        setHasPostCommented(hasCommentedArr);
        setHasPostReacted(response?.hasReactedArr);
      }
      setReactionsFeedPost(response?.reactionsFeedArr);
    } catch (err: any) {
      console.error(err.message);
    }
    setPublicationDataLoading(false);
  };

  return {
    publicationDataLoading,
    getPublicationData,
    publicationData,
    reactionsPostFeed,
    hasPostCommented,
    hasPostMirrored,
    hasPostReacted,
  };
};

export default usePostPage;
