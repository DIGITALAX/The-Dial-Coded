import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useContractWrite as useUnfollowContractWrite,
  usePrepareContractWrite as useUnfollowPrepareContractWrite,
  useSignTypedData,
} from "wagmi";
import createFollowTypedData from "../../../../graphql/mutations/follow";
import createUnFollowTypedData from "../../../../graphql/mutations/unfollow";
import getProfilePage from "../../../../graphql/queries/getProfilePage";
import followingData from "../../../../graphql/queries/profileData";
import whoCommentedPublications from "../../../../graphql/queries/whoCommentedPublications";
import { LENS_HUB_PROXY_ADDRESS_MUMBAI } from "../../../../lib/lens/constants";
import { omit, splitSignature } from "../../../../lib/lens/helpers";
import { setInsufficientFunds } from "../../../../redux/reducers/insufficientFunds";
import { RootState } from "../../../../redux/store";
import {
  PaginatedFollowersResult,
  PaginatedFollowingResult,
  PublicationsQueryRequest,
} from "../../../Common/types/lens.types";
import { FollowArgs, UseProfilePageResults } from "../types/profile.types";
import LensHubProxy from "./../../../../abis/LensHubProxy.json";
import lodash from "lodash";
import whoReactedublications from "../../../../graphql/queries/whoReactedPublication";
import {
  profilePublications,
  profilePublicationsAuth,
} from "../../../../graphql/queries/profilePublication";
import following from "../../../../graphql/queries/following";
import followers from "../../../../graphql/queries/followers";

const useProfilePage = (): UseProfilePageResults => {
  const router = useRouter();
  const [profileDataLoading, setProfileDataLoading] = useState<any>();
  const [profileData, setProfileData] = useState<any>();
  const [followLoading, setFollowLoading] = useState<boolean>(false);
  const [followArgs, setFollowArgs] = useState<FollowArgs>();
  const [unfollowArgs, setUnfollowArgs] = useState<any[]>([]);
  const [userFeed, setUserFeed] = useState<PublicationsQueryRequest[]>([]);
  const [paginatedResults, setPaginatedResults] = useState<any>();
  const { address } = useAccount();
  const { signTypedDataAsync } = useSignTypedData();
  const dispatch = useDispatch();
  const [isFollowedByMe, setIsFollowedByMe] = useState<boolean>(false);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [hasMirrored, setHasMirrored] = useState<boolean[]>([]);
  const [hasCommented, setHasCommented] = useState<boolean[]>([]);
  const [hasReacted, setHasReacted] = useState<boolean[]>([]);
  const [reactionsFeed, setReactionsFeed] = useState<any[]>([]);
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
  const lensProfile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.id
  );
  const isConnected = useSelector(
    (state: RootState) => state.app.walletConnectedReducer.value
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

  const { config, isSuccess } = usePrepareContractWrite({
    address: LENS_HUB_PROXY_ADDRESS_MUMBAI,
    abi: LensHubProxy,
    functionName: "followWithSig",
    enabled: Boolean(followArgs),
    args: [followArgs],
  });
  const {
    config: unfollowConfig,
    isSuccess: unfollowSuccess,
    error,
  } = useUnfollowPrepareContractWrite({
    address: LENS_HUB_PROXY_ADDRESS_MUMBAI,
    abi: LensHubProxy,
    functionName: "burnWithSig",
    enabled: Boolean(unfollowArgs),
    args: unfollowArgs,
  });

  const { writeAsync, isSuccess: followComplete } = useContractWrite(config);
  const { writeAsync: unfollowWriteAsync, isSuccess: unfollowComplete } =
    useUnfollowContractWrite(unfollowConfig);

  const followProfile = async (): Promise<void> => {
    setFollowLoading(true);
    try {
      const response = await createFollowTypedData({
        follow: [
          {
            profile: profileData?.id,
            followModule: null,
          },
        ],
      });

      const typedData: any = response?.data.createFollowTypedData.typedData;

      const signature: any = await signTypedDataAsync({
        domain: omit(typedData?.domain, ["__typename"]),
        types: omit(typedData?.types, ["__typename"]) as any,
        value: omit(typedData?.value, ["__typename"]) as any,
      });

      const { v, r, s } = splitSignature(signature);
      const followArgs: FollowArgs = {
        follower: address as string,
        profileIds: typedData.value.profileIds,
        datas: typedData.value.datas,
        sig: {
          v,
          r,
          s,
          deadline: typedData.value.deadline,
        },
      };
      setFollowArgs(followArgs);
    } catch (err: any) {
      console.error(err.message);
    }
    setFollowLoading(false);
  };

  const unFollowProfile = async (): Promise<void> => {
    setFollowLoading(true);
    try {
      const response = await createUnFollowTypedData({
        profile: profileData?.id,
      });

      const typedData: any = response?.data.createUnfollowTypedData.typedData;
      const signature: any = await signTypedDataAsync({
        domain: omit(typedData?.domain, ["__typename"]),
        types: omit(typedData?.types, ["__typename"]) as any,
        value: omit(typedData?.value, ["__typename"]) as any,
      });

      const { v, r, s } = splitSignature(signature);
      const sig = {
        v,
        r,
        s,
        deadline: typedData.value.deadline,
      };
      setUnfollowArgs([typedData.value.tokenId, sig]);
    } catch (err: any) {
      console.error(err.message);
    }
    setFollowLoading(false);
  };

  const getProfileData = async (handle: string): Promise<void> => {
    setProfileDataLoading(true);
    try {
      const { data } = await getProfilePage({
        handle: handle + ".test",
      });
      setProfileData(data?.profile);
    } catch (err: any) {
      console.error(err.message);
    }
    setProfileDataLoading(false);
  };

  const handleFollowingData = async (): Promise<void> => {
    try {
      const following = await followingData(handle + ".test", profileData?.id);
      setIsFollowedByMe(following?.data?.profile?.isFollowedByMe);
      setIsFollowing(following?.data?.profile?.isFollowing);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getUserProfileFeed = async () => {
    let sortedArr: any[];
    let pageData: any;
    try {
      if (!lensProfile) {
        const { data } = await profilePublications({
          profileId: profileData?.id,
          publicationTypes: ["POST", "COMMENT", "MIRROR"],
          limit: 30,
        });
        const arr: any[] = [...data?.publications?.items];
        sortedArr = arr.sort(
          (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
        );
        pageData = data?.publications?.pageInfo;
      } else {
        const { data } = await profilePublicationsAuth({
          profileId: profileData?.id,
          publicationTypes: ["POST", "COMMENT", "MIRROR"],
          limit: 30,
        });
        const arr: any[] = [...data?.publications?.items];
        sortedArr = arr.sort(
          (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
        );
        pageData = data?.publications?.pageInfo;
      }
      setUserFeed(sortedArr);
      setPaginatedResults(pageData);
      const response = await checkPostReactions(sortedArr);
      setHasReacted(response?.hasReactedArr);
      if (lensProfile) {
        const hasMirroredArr = await checkIfMirrored(sortedArr);
        setHasMirrored(hasMirroredArr);
        const hasCommentedArr = await checkIfCommented(sortedArr);
        setHasCommented(hasCommentedArr);
      }
      setReactionsFeed(response?.reactionsFeedArr);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getMoreUserProfileFeed = async (): Promise<void> => {
    let sortedArr: any[];
    let pageData: any;
    try {
      if (!lensProfile) {
        const { data } = await profilePublications({
          profileId: profileData?.id,
          publicationTypes: ["POST", "COMMENT", "MIRROR"],
          limit: 30,
          cursor: paginatedResults?.next,
        });

        const arr: any[] = [...data?.publications?.items];
        sortedArr = arr.sort(
          (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
        );
        pageData = data?.publications?.pageInfo;
      } else {
        const { data } = await profilePublicationsAuth({
          profileId: profileData?.id,
          publicationTypes: ["POST", "COMMENT", "MIRROR"],
          limit: 30,
          cursor: paginatedResults?.next,
        });

        const arr: any[] = [...data?.publications?.items];
        sortedArr = arr.sort(
          (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
        );
        pageData = data?.publications?.pageInfo;
      }
      setUserFeed(sortedArr);
      setPaginatedResults(pageData);
      const response = await checkPostReactions(sortedArr);
      setReactionsFeed([...reactionsFeed, ...response?.reactionsFeedArr]);
      if (lensProfile) {
        const hasMirroredArr = await checkIfMirrored(sortedArr);
        setHasMirrored([...hasMirrored, ...hasMirroredArr]);
        const hasCommentedArr = await checkIfCommented(sortedArr);
        setHasCommented([...hasCommented, ...hasCommentedArr]);
        setHasReacted([...hasReacted, ...response?.hasReactedArr]);
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const followWrite = async (): Promise<void> => {
    setFollowLoading(true);
    try {
      const tx = await writeAsync?.();
      await tx?.wait();
    } catch (err: any) {
      console.error(err.message);
      dispatch(setInsufficientFunds("failed"));
    }
    setFollowLoading(false);
  };

  const unfollowWrite = async (): Promise<void> => {
    setFollowLoading(true);
    try {
      const tx = await unfollowWriteAsync?.();
      await tx?.wait();
    } catch (err: any) {
      console.error(err.message);
      dispatch(setInsufficientFunds("failed"));
    }
    setFollowLoading(false);
  };

  const getFollowers = async (): Promise<void> => {
    setFollowersLoading(true);
    try {
      const { data } = await followers({
        profileId: profileData?.id,
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
        address: profileData?.ownedBy,
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
        profileId: profileData?.id,
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
        address: profileData?.ownedBy,
        limit: 50,
        cursor: paginatedFollowing?.next,
      });
      setUserFollowing([...userFollowing, ...data?.following?.items]);
      setPaginatedFollowing(data?.following?.pageInfo);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const {
    query: { handle },
  } = useRouter();

  useEffect(() => {
    if (handle) {
      getProfileData(handle as string);
    }
  }, [handle, lensProfile]);

  useEffect(() => {
    if (profileData) {
      getUserProfileFeed();
      handleFollowingData();
      getFollowing();
      getFollowers();
    }
  }, [profileData, router.asPath, lensProfile, isConnected]);

  useEffect(() => {
    if (isSuccess) {
      followWrite();
    }
    if (unfollowSuccess) {
      unfollowWrite();
    }
  }, [isSuccess, unfollowSuccess]);

  return {
    profileDataLoading,
    getProfileData,
    profileData,
    getMoreUserProfileFeed,
    userFeed,
    followProfile,
    unFollowProfile,
    followLoading,
    followArgs,
    dispatch,
    isFollowedByMe,
    isFollowing,
    hasMirrored,
    hasCommented,
    hasReacted,
    reactionsFeed,
    followersLoading,
    followingLoading,
    userFollowing,
    userFollowers,
    getMoreFollowers,
    getMoreFollowing,
  };
};

export default useProfilePage;
