import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  usePrepareSendTransaction,
  useSendTransaction,
  useSigner,
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
  ApprovedAllowanceAmount,
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
} from "../../../../graphql/queries/profilePublication";
import following from "../../../../graphql/queries/following";
import followers from "../../../../graphql/queries/followers";
import { setIndexModal } from "../../../../redux/reducers/indexModalSlice";
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
import checkIfFollowerOnly from "../../../../lib/lens/helpers/checkIfFollowerOnly";
import handleIndexCheck from "../../../../lib/lens/helpers/handleIndexCheck";
import handleCoinUSDConversion from "../../../../lib/lens/helpers/handleCoinUSDConversion";
import checkApproved from "../../../../lib/lens/helpers/checkApproved";
import { setFollowTypeValues } from "../../../../redux/reducers/followTypeValuesSlice";
import checkIndexed from "../../../../graphql/queries/checkIndexed";
import createFollowModule from "../../../../lib/lens/helpers/createFollowModule";
import { Contract, Signer } from "ethers";
import FollowNFT from "./../../../../abis/FollowNFT.json";
import broadcast from "../../../../graphql/mutations/broadcast";
import { setSearchTarget } from "../../../../redux/reducers/searchTargetSlice";
import createXmtpClient from "../../../../lib/xmtp/helpers/createXmtpClient";
import { setXmtpClient } from "../../../../redux/reducers/xmtpClientSlice";
import { setAccountPage } from "../../../../redux/reducers/accountPageSlice";
import getDefaultProfile from "../../../../graphql/queries/getDefaultProfile";
import { setLensProfile } from "../../../../redux/reducers/lensProfileSlice";

const useProfilePage = (): UseProfilePageResults => {
  const router = useRouter();
  const { data: signer } = useSigner();
  const [profileDataLoading, setProfileDataLoading] = useState<any>();
  const [profileData, setProfileData] = useState<any>();
  const [followLoading, setFollowLoading] = useState<boolean>(false);
  const [followArgs, setFollowArgs] = useState<FollowArgs>();
  const [userFeed, setUserFeed] = useState<PublicationSearchResult[]>([]);
  const [followInfoLoading, setFollowInfoLoading] = useState<boolean>(false);
  const [paginatedResults, setPaginatedResults] = useState<any>();
  const { address } = useAccount();
  const { signTypedDataAsync } = useSignTypedData();
  const dispatch = useDispatch();
  const [approvalLoading, setApprovalLoading] = useState<boolean>(false);
  const [isFollowedByMe, setIsFollowedByMe] = useState<boolean>(false);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [hasMirrored, setHasMirrored] = useState<boolean[]>([]);
  const [hasCommented, setHasCommented] = useState<boolean[]>([]);
  const [hasReacted, setHasReacted] = useState<boolean[]>([]);
  const [reactionsFeed, setReactionsFeed] = useState<any[]>([]);
  const [mixtapes, setMixtapes] = useState<any[]>([]);
  const [mixtapePaginated, setMixtapePaginated] = useState<any>();
  const [hotReactionsFeed, setHotReactionsFeed] = useState<boolean[]>([]);
  const [followerOnly, setFollowerOnly] = useState<boolean[]>([]);
  const [mixtapeMirror, setMixtapeMirror] = useState<boolean[]>([]);
  const [hasHotReacted, setHasHotReacted] = useState<boolean[]>([]);
  const [hasHotMirrored, setHasHotMirrored] = useState<boolean[]>([]);
  const [hasHotCommented, setHasHotCommented] = useState<boolean[]>([]);
  const [publicationsLoading, setPublicationsLoading] =
    useState<boolean>(false);
  const [mixtapesLoading, setMixtapesLoading] = useState<boolean>(false);
  const indexerModal = useSelector(
    (state: RootState) => state.app.indexModalReducer
  );
  const approvalArgs = useSelector(
    (state: RootState) => state.app.approvalArgsReducer.args
  );
  const xmtpClient = useSelector(
    (state: RootState) => state.app.xmtpClientReducer.value
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
    (state: RootState) => state.app.lensProfileReducer.profile
  );
  const isConnected = useSelector(
    (state: RootState) => state.app.walletConnectedReducer.value
  );
  const hearted = useSelector(
    (state: RootState) => state.app.heartedReducer?.direction
  );
  const followTypes = useSelector(
    (state: RootState) => state.app.followTypeValuesReducer
  );

  const { config, isSuccess } = usePrepareContractWrite({
    address: LENS_HUB_PROXY_ADDRESS_MUMBAI,
    abi: LensHubProxy,
    functionName: "followWithSig",
    enabled: Boolean(followArgs),
    args: [followArgs],
  });

  const { writeAsync } = useContractWrite(config);

  const { config: approvalConfig } = usePrepareSendTransaction({
    request: {
      to: approvalArgs?.to as string,
      from: approvalArgs?.from as string,
      data: approvalArgs?.data as string,
    },
    // enabled: Boolean(approvalSendEnabled),
  });

  const { sendTransactionAsync } = useSendTransaction(approvalConfig);

  const callApprovalSign = async (): Promise<void> => {
    try {
      const tx = await sendTransactionAsync?.();
      await tx?.wait();
      await checkIndexed(tx?.hash);
      await getFollowInfo();
    } catch (err: any) {
      console.error(err.message);
      dispatch(setInsufficientFunds("failed"));
    }
  };

  const approveCurrency = async (): Promise<void> => {
    setApprovalLoading(true);
    // setApprovalSendEnabled(true);
    try {
      await callApprovalSign();
    } catch (err: any) {
      console.error(err.message);
    }
    setApprovalLoading(false);
  };

  const getFollowInfo = async (): Promise<void> => {
    try {
      if (!profileData?.followModule) {
        dispatch(
          setFollowTypeValues({
            actionType: profileData?.followModule?.type,
            actionCurrency: undefined,
            actionAddress: undefined,
            actionValue: undefined,
            actionUSD: undefined,
            actionApproved: undefined,
            actionModal: false,
          })
        );
        await followTypedData();
      } else {
        setFollowInfoLoading(true);
        if (profileData?.followModule?.type === "RevertCollectModule") {
          dispatch(
            setFollowTypeValues({
              actionType: profileData?.followModule?.type,
              actionCurrency: undefined,
              actionAddress: undefined,
              actionValue: undefined,
              actionUSD: undefined,
              actionApproved: undefined,
              actionModal: true,
            })
          );
        } else {
          const convertedValue = await handleCoinUSDConversion(
            profileData?.followModule?.amount?.asset?.symbol,
            profileData?.followModule?.amount?.value
          );
          const approvalData: ApprovedAllowanceAmount | void =
            await checkApproved(
              profileData?.followModule?.amount?.asset?.address,
              null,
              profileData?.followModule?.type,
              null,
              profileData?.followModule?.amount?.value,
              dispatch,
              isConnected,
              lensProfile?.id
            );
          const isApproved = parseInt(approvalData?.allowance as string, 16);
          dispatch(
            setFollowTypeValues({
              actionType: profileData?.followModule?.type,
              actionCurrency: profileData?.followModule?.amount?.asset?.symbol,
              actionAddress: profileData?.followModule?.amount?.asset?.address,
              actionValue: profileData?.followModule?.amount?.value,
              actionUSD: convertedValue,
              actionApproved:
                isApproved > profileData?.followModule?.amount?.value
                  ? true
                  : false,
              actionModal: true,
            })
          );
        }
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setFollowInfoLoading(false);
  };

  const followTypedData = async (): Promise<void> => {
    setFollowLoading(true);
    const followModule = createFollowModule(
      followTypes?.type,
      Number(followTypes?.value),
      setFollowLoading,
      followTypes?.address,
      profileData?.ownedBy,
      true
    );
    try {
      const response = await createFollowTypedData({
        follow: [
          {
            profile: profileData?.id,
            followModule,
          },
        ],
      });

      const typedData: any = response?.data.createFollowTypedData.typedData;

      const signature: any = await signTypedDataAsync({
        domain: omit(typedData?.domain, ["__typename"]),
        types: omit(typedData?.types, ["__typename"]) as any,
        value: omit(typedData?.value, ["__typename"]) as any,
      });

      const broadcastResult: any = await broadcast({
        id: response?.data?.createFollowTypedData?.id,
        signature,
      });

      if (broadcastResult?.data?.broadcast?.__typename !== "RelayerResult") {
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
      } else {
        clearFollow();
        setFollowLoading(false);
        setTimeout(async () => {
          await handleIndexCheck(
            broadcastResult?.data?.broadcast?.txHash,
            dispatch,
            false
          );
          await refetchProfile();
        }, 7000);
      }
    } catch (err: any) {
      setFollowLoading(false);
      if (err.message.includes("You do not have enough")) {
        dispatch(setInsufficientFunds("insufficient"));
      }
      console.error(err.message);
    }
  };

  const followProfile = async (): Promise<void> => {
    setFollowLoading(true);
    try {
      await getFollowInfo();
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

      const broadcastResult: any = await broadcast({
        id: response?.data?.createUnfollowTypedData?.id,
        signature,
      });
      if (broadcastResult?.data?.broadcast?.__typename !== "RelayerResult") {
        const { v, r, s } = splitSignature(signature);
        const sig = {
          v,
          r,
          s,
          deadline: typedData.value.deadline,
        };

        const unfollowNFTContract = new Contract(
          typedData.domain.verifyingContract,
          FollowNFT,
          signer as Signer
        );
        const tx = await unfollowNFTContract.burnWithSig(
          typedData.value.tokenId,
          sig
        );
        dispatch(
          setIndexModal({
            actionValue: true,
            actionMessage: "Indexing Interaction",
          })
        );
        const res = await tx?.wait();
        await handleIndexCheck(res?.transactionHash, dispatch, false);
        await refetchProfile();
      } else {
        dispatch(
          setIndexModal({
            actionValue: true,
            actionMessage: "Indexing Interaction",
          })
        );
        setTimeout(async () => {
          await handleIndexCheck(
            broadcastResult?.data?.broadcast?.txHash,
            dispatch,
            false
          );
          await refetchProfile();
        }, 7000);
      }
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
    setPublicationsLoading(true);
    try {
      if (!lensProfile?.id) {
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
      setPublicationsLoading(false);
      const isOnlyFollowers = await checkIfFollowerOnly(
        filteredArr,
        lensProfile?.id
      );
      setFollowerOnly(isOnlyFollowers as boolean[]);
      const mixtapeMirrors = checkIfMixtapeMirror(filteredArr);
      setMixtapeMirror(mixtapeMirrors);
      setPaginatedResults(pageData);
      const response = await checkPostReactions(filteredArr, lensProfile?.id);
      setHasReacted(response?.hasReactedArr);
      if (lensProfile?.id) {
        const hasMirroredArr = await checkIfMirrored(
          filteredArr,
          lensProfile?.id
        );
        setHasMirrored(hasMirroredArr);
        const hasCommentedArr = await checkIfCommented(
          filteredArr,
          lensProfile?.id
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
      if (!lensProfile?.id) {
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
      const response = await checkPostReactions(filteredArr, lensProfile?.id);
      setReactionsFeed([...reactionsFeed, ...response?.reactionsFeedArr]);
      if (lensProfile?.id) {
        const hasMirroredArr = await checkIfMirrored(
          filteredArr,
          lensProfile?.id
        );
        setHasMirrored([...hasMirrored, ...hasMirroredArr]);
        const hasCommentedArr = await checkIfCommented(
          filteredArr,
          lensProfile?.id
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
    setMixtapesLoading(true);
    try {
      if (!lensProfile?.id) {
        const { data } = await profilePublications({
          sources: "thedial",
          profileId: profileData?.id,
          publicationTypes: ["POST"],
          limit: 30,
          metadata: {
            tags: {
              all: ["dialMixtape"],
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
              all: ["dialMixtape"],
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
      setMixtapesLoading(false);
      const response = await checkPostReactions(sortedArr, lensProfile?.id);
      setHotReactionsFeed(response?.reactionsFeedArr);
      if (lensProfile?.id) {
        const hasMirroredArr = await checkIfMirrored(
          sortedArr,
          lensProfile?.id
        );
        setHasHotMirrored(hasMirroredArr);
        const hasCommentedArr = await checkIfCommented(
          sortedArr,
          lensProfile?.id
        );
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
      if (!lensProfile?.id) {
        const { data } = await profilePublications({
          sources: "thedial",
          profileId: profileData?.id,
          publicationTypes: ["POST"],
          limit: 30,
          metadata: {
            tags: {
              all: ["dialMixtape"],
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
              all: ["dialMixtape"],
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
      const response = await checkPostReactions(sortedArr, lensProfile?.id);
      setHotReactionsFeed([...hotReactionsFeed, ...response?.reactionsFeedArr]);
      if (lensProfile?.id) {
        const hasMirroredArr = await checkIfMirrored(
          sortedArr,
          lensProfile?.id
        );
        setHasHotMirrored([...hasHotMirrored, ...hasMirroredArr]);
        const hasCommentedArr = await checkIfCommented(
          sortedArr,
          lensProfile?.id
        );
        setHasHotCommented([...hasHotCommented, ...hasCommentedArr]);
        setHasHotReacted([...hasHotReacted, ...response?.hasReactedArr]);
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const clearFollow = () => {
    dispatch(
      setIndexModal({
        actionValue: true,
        actionMessage: "Indexing Interaction",
      })
    );
    dispatch(
      setFollowTypeValues({
        actionType: undefined,
        actionCurrency: undefined,
        actionAddress: undefined,
        actionValue: undefined,
        actionUSD: undefined,
        actionApproved: undefined,
        actionModal: false,
      })
    );
  };

  const followWrite = async (): Promise<void> => {
    setFollowLoading(true);
    try {
      const tx = await writeAsync?.();
      clearFollow();
      const res = await tx?.wait();
      await handleIndexCheck(res?.transactionHash, dispatch, false);
      await refetchProfile();
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

  const handleSendDM = async (profileData: Profile) => {
    if (!xmtpClient) {
      const xmtp = await createXmtpClient(signer as Signer);
      dispatch(setXmtpClient(xmtp));
    }
    dispatch(setLayout("Account"));
    dispatch(setAccountPage("conversations"));
    dispatch(setChosenDMProfile(profileData));
    dispatch(setSearchTarget(profileData?.handle));
    router.push("/?=conversations/#Account");
  };

  const refetchProfile = async (): Promise<void> => {
    try {
      const profile = await getDefaultProfile(address);
      dispatch(setLensProfile(profile?.data?.defaultProfile));
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
      getUserMixtapes();
      handleFollowingData();
      getFollowing(
        setFollowingLoading,
        setPaginatedFollowing,
        setUserFollowing,
        profileData?.ownedBy
      );
      getFollowers(
        setFollowersLoading,
        setPaginatedFollowers,
        setUserFollowers,
        profileData?.id
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
  }, [isSuccess]);

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
    followerOnly,
    followInfoLoading,
    followTypedData,
    approvalLoading,
    approveCurrency,
    mixtapesLoading,
    publicationsLoading,
  };
};
export default useProfilePage;
