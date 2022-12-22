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
import profilePublicationsNoAuth from "../../../../graphql/queries/profilePublicationNoAuth";
import { LENS_HUB_PROXY_ADDRESS_MUMBAI } from "../../../../lib/lens/constants";
import { omit, splitSignature } from "../../../../lib/lens/helpers";
import { setInsufficientFunds } from "../../../../redux/reducers/insufficientFunds";
import { RootState } from "../../../../redux/store";
import { PublicationsQueryRequest } from "../../../Common/types/lens.types";
import { FollowArgs, UseProfilePageResults } from "../types/profile.types";
import LensHubProxy from "./../../../../abis/LensHubProxy.json";

const useProfilePage = (): UseProfilePageResults => {
  const [profileDataLoading, setProfileDataLoading] = useState<any>();
  const [profileData, setProfileData] = useState<any>();
  const [followLoading, setFollowLoading] = useState<boolean>(false);
  const [followArgs, setFollowArgs] = useState<FollowArgs>();
  const [unfollowArgs, setUnfollowArgs] = useState<any[]>([]);
  const { address } = useAccount();
  const { signTypedDataAsync } = useSignTypedData();
  const dispatch = useDispatch();
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
  const [isFollowedByMe, setIsFollowedByMe] = useState<boolean>(false);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const lensProfile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.id
  );
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

      const typedData: any = response.data.createFollowTypedData.typedData;

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

      const typedData: any = response.data.createUnfollowTypedData.typedData;
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

  const router = useRouter();
  const [userFeed, setUserFeed] = useState<PublicationsQueryRequest[]>([]);
  const [paginatedResults, setPaginatedResults] = useState<any>();

  const getUserProfileFeed = async () => {
    try {
      const { data } = await profilePublicationsNoAuth({
        profileId: profileData?.id,
        publicationTypes: ["POST", "COMMENT", "MIRROR"],
        limit: 30,
      });
      const arr: any[] = [...data?.publications?.items];
      const sortedArr: any[] = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      setUserFeed(sortedArr);
      setPaginatedResults(data?.publications?.pageInfo);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getMoreUserProfileFeed = async (): Promise<void> => {
    try {
      const { data } = await profilePublicationsNoAuth({
        profileId: profileData?.id,
        publicationTypes: ["POST", "COMMENT", "MIRROR"],
        limit: 30,
        cursor: paginatedResults?.next,
      });

      const arr: any[] = [...data?.publications?.items];
      const sortedArr: any[] = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      setUserFeed(sortedArr);
      setPaginatedResults(data?.publications?.pageInfo);
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
    }
  }, [profileData, router.asPath]);

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
  };
};

export default useProfilePage;
