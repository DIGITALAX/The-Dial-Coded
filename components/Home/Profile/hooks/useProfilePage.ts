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
import { LENS_HUB_PROXY_ADDRESS_MUMBAI } from "../../../../lib/lens/constants";
import { setInsufficientFunds } from "../../../../redux/reducers/insufficientFunds";
import { RootState } from "../../../../redux/store";
import {
  PaginatedFollowersResult,
  PaginatedFollowingResult,
  Profile,
  PublicationSearchResult,
} from "../../../Common/types/lens.types";
import { FollowArgs, UseProfilePageResults } from "../types/profile.types";
import LensHubProxy from "./../../../../abis/LensHubProxy.json";
import lodash from "lodash";
import {
  profilePublications,
  profilePublicationsAuth,
  whoCommentedPublications,
} from "../../../../graphql/queries/profilePublication";
import following from "../../../../graphql/queries/following";
import followers from "../../../../graphql/queries/followers";
import { setIndexModal } from "../../../../redux/reducers/indexModalSlice";
import checkIndexed from "../../../../graphql/queries/checkIndexed";
import { setChosenDMProfile } from "../../../../redux/reducers/chosenDMProfileSlice";
import { setLayout } from "../../../../redux/reducers/layoutSlice";
import omit from "../../../../lib/lens/helpers/omit";
import splitSignature from "../../../../lib/lens/helpers/splitSignature";
import checkPostReactions from "../../../../lib/lens/helpers/checkPostReactions";
import checkIfMirrored from "../../../../lib/lens/helpers/checkIfMirrored";
import checkIfCommented from "../../../../lib/lens/helpers/checkIfCommented";
import checkIfMixtapeMirror from "../../../../lib/lens/helpers/checkIfMixtapeMirror";
import getFollowing from "../../../../lib/lens/helpers/getFollowing";
import getFollowers from "../../../../lib/lens/helpers/getFollowers";

const useProfilePage = (): UseProfilePageResults => {
  const router = useRouter();
  const [profileDataLoading, setProfileDataLoading] = useState<any>();
  const [profileData, setProfileData] = useState<any>();
  const [followLoading, setFollowLoading] = useState<boolean>(false);
  const [followArgs, setFollowArgs] = useState<FollowArgs>();
  const [unfollowArgs, setUnfollowArgs] = useState<any[]>();
  const [userFeed, setUserFeed] = useState<PublicationSearchResult[]>([]);
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
  const [mixtapes, setMixtapes] = useState<any[]>([]);
  const [mixtapePaginated, setMixtapePaginated] = useState<any>();
  const [hotReactionsFeed, setHotReactionsFeed] = useState<boolean[]>([]);
  const [mixtapeMirror, setMixtapeMirror] = useState<boolean[]>([]);
  const [hasHotReacted, setHasHotReacted] = useState<boolean[]>([]);
  const [hasHotMirrored, setHasHotMirrored] = useState<boolean[]>([]);
  const [hasHotCommented, setHasHotCommented] = useState<boolean[]>([]);
  const indexerModal = useSelector(
    (state: RootState) => state.app.indexModalReducer
  );
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
  const hearted = useSelector(
    (state: RootState) => state.app.heartedReducer?.direction
  );

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
          sources: "thedial",
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
          sources: "thedial",
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
      setUserFeed(filteredArr);
      const mixtapeMirrors = checkIfMixtapeMirror(filteredArr);
      setMixtapeMirror(mixtapeMirrors);
      setPaginatedResults(pageData);
      const response = await checkPostReactions(filteredArr, lensProfile);
      setHasReacted(response?.hasReactedArr);
      if (lensProfile) {
        const hasMirroredArr = await checkIfMirrored(filteredArr, lensProfile);
        setHasMirrored(hasMirroredArr);
        const hasCommentedArr = await checkIfCommented(
          filteredArr,
          lensProfile
        );
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
          sources: "thedial",
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
      setPaginatedResults(pageData);
      const mixtapeMirrors = checkIfMixtapeMirror(filteredArr);
      setMixtapeMirror([...mixtapeMirror, ...mixtapeMirrors]);
      const response = await checkPostReactions(filteredArr, lensProfile);
      setReactionsFeed([...reactionsFeed, ...response?.reactionsFeedArr]);
      if (lensProfile) {
        const hasMirroredArr = await checkIfMirrored(filteredArr, lensProfile);
        setHasMirrored([...hasMirrored, ...hasMirroredArr]);
        const hasCommentedArr = await checkIfCommented(
          filteredArr,
          lensProfile
        );
        setHasCommented([...hasCommented, ...hasCommentedArr]);
        setHasReacted([...hasReacted, ...response?.hasReactedArr]);
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getUserMixtapes = async (): Promise<void> => {
    let sortedArr: any[];
    let pageData: any;
    try {
      if (!lensProfile) {
        const { data } = await profilePublications({
          sources: "thedial",
          profileId: profileData?.id,
          publicationTypes: ["POST"],
          limit: 30,
          metadata: {
            tags: {
              all: ["mixtape"],
            },
          },
        });
        const arr: any[] = [...data?.publications?.items];
        sortedArr = arr.sort(
          (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
        );
        pageData = data?.publications?.pageInfo;
      } else {
        const { data } = await profilePublicationsAuth({
          sources: "thedial",
          profileId: profileData?.id,
          publicationTypes: ["POST"],
          limit: 30,
          metadata: {
            tags: {
              all: ["mixtape"],
            },
          },
        });

        const arr: any[] = [...data?.publications?.items];
        sortedArr = arr.sort(
          (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
        );
        pageData = data?.publications?.pageInfo;
      }
      setMixtapes(sortedArr);
      setMixtapePaginated(pageData);
      const response = await checkPostReactions(sortedArr, lensProfile);
      setHotReactionsFeed(response?.reactionsFeedArr);
      if (lensProfile) {
        const hasMirroredArr = await checkIfMirrored(sortedArr, lensProfile);
        setHasHotMirrored(hasMirroredArr);
        const hasCommentedArr = await checkIfCommented(sortedArr, lensProfile);
        setHasHotCommented(hasCommentedArr);
        setHasHotReacted(response?.hasReactedArr);
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const getMoreUserMixtapes = async (): Promise<void> => {
    let sortedArr: any[];
    let pageData: any;
    try {
      if (!lensProfile) {
        const { data } = await profilePublications({
          sources: "thedial",
          profileId: profileData?.id,
          publicationTypes: ["POST"],
          limit: 30,
          metadata: {
            tags: {
              all: ["mixtape"],
            },
          },
          cursor: mixtapePaginated?.next,
        });
        const arr: any[] = [...data?.publications?.items];
        sortedArr = arr.sort(
          (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
        );
        pageData = data?.publications?.pageInfo;
      } else {
        const { data } = await profilePublicationsAuth({
          sources: "thedial",
          profileId: profileData?.id,
          publicationTypes: ["POST"],
          limit: 30,
          metadata: {
            tags: {
              all: ["mixtape"],
            },
          },
          cursor: mixtapePaginated?.next,
        });
        const arr: any[] = [...data?.publications?.items];
        sortedArr = arr.sort(
          (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
        );
        pageData = data?.publications?.pageInfo;
      }
      setMixtapes([...mixtapes, ...sortedArr]);
      setMixtapePaginated(pageData);
      const response = await checkPostReactions(sortedArr, lensProfile);
      setHotReactionsFeed([...hotReactionsFeed, ...response?.reactionsFeedArr]);
      if (lensProfile) {
        const hasMirroredArr = await checkIfMirrored(sortedArr, lensProfile);
        setHasHotMirrored([...hasHotMirrored, ...hasMirroredArr]);
        const hasCommentedArr = await checkIfCommented(sortedArr, lensProfile);
        setHasHotCommented([...hasHotCommented, ...hasCommentedArr]);
        setHasHotReacted([...hasHotReacted, ...response?.hasReactedArr]);
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const followWrite = async (): Promise<void> => {
    setFollowLoading(true);
    try {
      const tx = await writeAsync?.();
      dispatch(
        setIndexModal({
          actionValue: true,
          actionMessage: "Indexing Interaction",
        })
      );
      const res = await tx?.wait();
      const indexedStatus = await checkIndexed(res?.transactionHash);
      if (
        indexedStatus?.data?.hasTxHashBeenIndexed?.metadataStatus?.status ===
        "SUCCESS"
      ) {
        dispatch(
          setIndexModal({
            actionValue: true,
            actionMessage: "Successfully Indexed",
          })
        );
      } else {
        dispatch(
          setIndexModal({
            actionValue: true,
            actionMessage: "Follow Unsuccessful, Please Try Again",
          })
        );
      }
      setTimeout(() => {
        dispatch(
          setIndexModal({
            actionValue: false,
            actionMessage: undefined,
          })
        );
      }, 3000);
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
      dispatch(
        setIndexModal({
          actionValue: true,
          actionMessage: "Indexing Interaction",
        })
      );
      const res = await tx?.wait();
      const indexedStatus = await checkIndexed(res?.transactionHash);
      if (
        indexedStatus?.data?.hasTxHashBeenIndexed?.metadataStatus?.status ===
        "SUCCESS"
      ) {
        dispatch(
          setIndexModal({
            actionValue: true,
            actionMessage: "Successfully Indexed",
          })
        );
      } else {
        dispatch(
          setIndexModal({
            actionValue: true,
            actionMessage: "Unfollow Unsuccessful, Please Try Again",
          })
        );
      }
      setTimeout(() => {
        dispatch(
          setIndexModal({
            actionValue: false,
            actionMessage: undefined,
          })
        );
      }, 3000);
    } catch (err: any) {
      console.error(err.message);
      dispatch(setInsufficientFunds("failed"));
    }
    setFollowLoading(false);
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

  const handleSendDM = (profileData: Profile) => {
    router.push("/#Account");
    dispatch(setLayout("Account"));
    dispatch(setChosenDMProfile(profileData));
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
      getUserMixtapes();
      handleFollowingData();
      getFollowing(
        setFollowingLoading,
        setPaginatedFollowing,
        setUserFollowing,
        address
      );
      getFollowers(
        setFollowersLoading,
        setPaginatedFollowers,
        setUserFollowers,
        lensProfile
      );
    }
  }, [
    profileData,
    router.asPath,
    lensProfile,
    isConnected,
    indexerModal.message,
    indexerModal.value,
    hearted,
  ]);

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
    getMoreUserMixtapes,
    mixtapes,
    hasHotReacted,
    hasHotCommented,
    hasHotMirrored,
    hotReactionsFeed,
    mixtapeMirror,
    handleSendDM,
  };
};

export default useProfilePage;
