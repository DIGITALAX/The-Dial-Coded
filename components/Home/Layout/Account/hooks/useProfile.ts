import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  profilePublicationsAuth,
  whoCommentedPublications,
} from "../../../../../graphql/queries/profilePublication";
import whoReactedublications from "../../../../../graphql/queries/whoReactedPublication";
import { RootState } from "../../../../../redux/store";
import {
  PaginatedFollowersResult,
  PaginatedFollowingResult,
  PublicationSearchResult,
} from "../../../../Common/types/lens.types";
import lodash from "lodash";
import followers from "../../../../../graphql/queries/followers";
import following from "../../../../../graphql/queries/following";
import { useAccount } from "wagmi";

const useProfile = () => {
  const selectProfile = useSelector(
    (state: RootState) => state.app.accountPageReducer.value
  );
  const profileId = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.id
  );
  const indexerModal = useSelector(
    (state: RootState) => state.app.indexModalReducer
  );
  const hearted = useSelector(
    (state: RootState) => state.app.heartedReducer?.direction
  );
  const { address } = useAccount();
  const [userFeed, setUserFeed] = useState<PublicationSearchResult[]>([]);
  const [hasMirrored, setHasMirrored] = useState<boolean[]>([]);
  const [hasCommented, setHasCommented] = useState<boolean[]>([]);
  const [hasReacted, setHasReacted] = useState<boolean[]>([]);
  const [reactionsFeed, setReactionsFeed] = useState<any[]>([]);
  const [paginatedResults, setPaginatedResults] = useState<any>();
  const [profileDataLoading, setProfileDataLoading] = useState<boolean>(false);
  const [mixtapeMirror, setMixtapeMirror] = useState<boolean[]>([]);
  const [followersLoading, setFollowersLoading] = useState<boolean>(false);
  const [followingLoading, setFollowingLoading] = useState<boolean>(false);
  const [userFollowing, setUserFollowing] = useState<
    PaginatedFollowingResult[]
  >([]);
  const [userFollowers, setUserFollowers] = useState<
    PaginatedFollowersResult[]
  >([]);
  const [paginatedFollowers, setPaginatedFollowers] = useState<any>();
  const [paginatedFollowing, setPaginatedFollowing] = useState<any>();

  const getFollowers = async (): Promise<void> => {
    setFollowersLoading(true);
    try {
      const { data } = await followers({
        profileId: profileId,
        limit: 50,
      });
      setUserFollowers(data?.followers?.items);
      setPaginatedFollowers(data?.followers?.pageInfo);
    } catch (err: any) {
      console.error(err.message);
    }
    setFollowersLoading(false);
  };

  const getFollowing = async (): Promise<void> => {
    setFollowingLoading(true);
    try {
      const { data } = await following({
        address: address,
        limit: 50,
      });
      setUserFollowing(data?.following?.items);
      setPaginatedFollowing(data?.following?.pageInfo);
    } catch (err: any) {
      console.error(err.message);
    }
    setFollowingLoading(false);
  };

  const getMoreFollowers = async (): Promise<void> => {
    try {
      const { data } = await followers({
        profileId: profileId,
        limit: 50,
        cursor: paginatedFollowers?.next,
      });
      setUserFollowers([...userFollowers, ...data?.followers?.items]);
      setPaginatedFollowers(data?.followers?.pageInfo);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getMoreFollowing = async (): Promise<void> => {
    try {
      const { data } = await following({
        address: address,
        limit: 50,
        cursor: paginatedFollowing?.next,
      });
      setUserFollowing([...userFollowing, ...data?.following?.items]);
      setPaginatedFollowing(data?.following?.pageInfo);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const checkIfMixtapeMirror = (arr: any[]): boolean[] => {
    let checkedArr: boolean[] = [];
    lodash.filter(arr, (item) => {
      if (item?.__typename === "Mirror") {
        if (item?.mirrorOf?.metadata?.content.includes("*Dial Mixtape*"))
          checkedArr.push(true);
      } else {
        checkedArr.push(false);
      }
    });

    return checkedArr;
  };

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
          (arr) => arr?.profile?.id === profileId
        );
        hasReactedArr.push(checkReacted?.length > 0 ? true : false);
      }
      return { hasReactedArr, reactionsFeedArr };
    } catch (err: any) {
      console.error(err.message);
    }
  };

  // did mirror
  const checkIfMirrored = async (arr: any[]): Promise<any> => {
    try {
      const { data } = await profilePublicationsAuth({
        profileId: profileId,
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
      while (loopMirroredArray?.length === 50) {
        const { mirroredValues, paginatedData } = await checkIfMoreMirrored(
          pageData ? pageData : data?.publications?.pageInfo
        );
        loopMirroredArray = mirroredValues;
        pageData = paginatedData;
        mirroredArray = [...mirroredArray, ...mirroredValues];
      }
      let hasMirroredArr: boolean[] = [];
      for (let i = 0; i < arr?.length; i++) {
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
      const { data } = await profilePublicationsAuth({
        profileId: profileId,
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
          (comment) => comment?.profile.id === profileId
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

  const getUserProfileFeed = async () => {
    setProfileDataLoading(true);
    try {
      const { data } = await profilePublicationsAuth({
        sources: "thedial",
        profileId: profileId,
        publicationTypes: ["POST", "COMMENT", "MIRROR"],
        limit: 30,
      });
      const arr: any[] = [...data?.publications?.items];
      const sortedArr = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      const filteredArr = lodash.filter(sortedArr, (arr: any) => {
        if (arr?.__typename === "Post") {
          if (!arr?.metadata?.content.includes("*Dial Mixtape*")) {
            return true;
          } else {
            return false;
          }
        } else {
          return true;
        }
      });
      setUserFeed(filteredArr);
      setPaginatedResults(data?.publications?.pageInfo);
      const response = await checkPostReactions(filteredArr);
      setHasReacted(response?.hasReactedArr);
      const mixtapeMirrors = checkIfMixtapeMirror(filteredArr);
      setMixtapeMirror(mixtapeMirrors);
      const hasMirroredArr = await checkIfMirrored(filteredArr);
      setHasMirrored(hasMirroredArr);
      const hasCommentedArr = await checkIfCommented(filteredArr);
      setHasCommented(hasCommentedArr);
      setReactionsFeed(response?.reactionsFeedArr);
    } catch (err: any) {
      console.error(err.message);
    }
    setProfileDataLoading(false);
  };

  const getMoreUserProfileFeed = async (): Promise<void> => {
    try {
      const { data } = await profilePublicationsAuth({
        sources: "thedial",
        profileId: profileId,
        publicationTypes: ["POST", "COMMENT", "MIRROR"],
        limit: 30,
        cursor: paginatedResults?.next,
      });
      const arr: any[] = [...data?.publications?.items];
      const sortedArr = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      const filteredArr = lodash.filter(sortedArr, (arr) => {
        if (arr?.__typename === "Post") {
          if (!arr?.metadata?.content.includes("*Dial Mixtape*")) {
            return true;
          } else {
            return false;
          }
        } else {
          return true;
        }
      });
      setUserFeed([...userFeed, ...filteredArr]);
      setPaginatedResults(data?.publications?.pageInfo);
      const response = await checkPostReactions(filteredArr);
      setReactionsFeed([...reactionsFeed, ...response?.reactionsFeedArr]);
      const mixtapeMirrors = checkIfMixtapeMirror(filteredArr);
      setMixtapeMirror([...mixtapeMirror, ...mixtapeMirrors]);
      const hasMirroredArr = await checkIfMirrored(filteredArr);
      setHasMirrored([...hasMirrored, ...hasMirroredArr]);
      const hasCommentedArr = await checkIfCommented(filteredArr);
      setHasCommented([...hasCommented, ...hasCommentedArr]);
      setHasReacted([...hasReacted, ...response?.hasReactedArr]);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (selectProfile === "profile feed") {
      getUserProfileFeed();
    }
    if (selectProfile === "stats") {
      getFollowing();
      getFollowers();
    }
  }, [selectProfile, indexerModal.value, indexerModal.message, hearted]);

  return {
    profileDataLoading,
    getMoreUserProfileFeed,
    userFeed,
    hasMirrored,
    hasCommented,
    hasReacted,
    reactionsFeed,
    userFollowers,
    userFollowing,
    getMoreFollowers,
    getMoreFollowing,
    followersLoading,
    followingLoading,
    mixtapeMirror,
  };
};

export default useProfile;
