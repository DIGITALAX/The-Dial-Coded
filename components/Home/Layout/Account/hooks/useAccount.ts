import { FormEvent, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAccountPage } from "../../../../../redux/reducers/accountPageSlice";
import {
  AccountData,
  ImageArgsType,
  ProfileArgsType,
  UseAccountResult,
} from "../types/account.types";
import { v4 as uuidv4 } from "uuid";
import {
  profileMetadata,
  dispatchProfileMetadata,
} from "../../../../../graphql/mutations/profileMetadata";
import { RootState } from "../../../../../redux/store";
import {
  useContractWrite,
  usePrepareContractWrite,
  useSignTypedData,
} from "wagmi";
import {
  LENS_HUB_PROXY_ADDRESS_MUMBAI,
  LENS_PERIPHERY_CONTRACT_MUMBAI,
} from "../../../../../lib/lens/constants";
import LensHubProxy from "./../../../../../abis/LensHubProxy.json";
import LensHubPeriphery from "./../../../../../abis/LensPeriphery.json";
import {
  profileImageUpload,
  dispatchProfileImage,
} from "../../../../../graphql/mutations/profileImage";
import { setInsufficientFunds } from "../../../../../redux/reducers/insufficientFunds";
import { setIndexModal } from "../../../../../redux/reducers/indexModalSlice";
import { setNotifications } from "../../../../../redux/reducers/notificationsSlice";
import splitSignature from "../../../../../lib/lens/helpers/splitSignature";
import omit from "../../../../../lib/lens/helpers/omit";
import compressImageFiles from "../../../../../lib/misc/helpers/compressImageFiles";
import fileLimitAlert from "../../../../../lib/misc/helpers/fileLimitAlert";
import handleIndexCheck from "../../../../../lib/lens/helpers/handleIndexCheck";
import createSetFollowTypedData from "../../../../../graphql/mutations/followType";
import { useAccount as useAccountWagmi } from "wagmi";
import { Erc20 } from "../../../../Common/types/lens.types";
import getDefaultProfile from "../../../../../graphql/queries/getDefaultProfile";
import { setLensProfile } from "../../../../../redux/reducers/lensProfileSlice";
import availableCurrencies from "../../../../../lib/lens/helpers/availableCurrencies";
import createFollowModule from "../../../../../lib/lens/helpers/createFollowModule";
import broadcast from "../../../../../graphql/mutations/broadcast";

const useAccount = (): UseAccountResult => {
  const accountTitles: string[] = [
    "account",
    "profile feed",
    "stats",
    "notifications",
    "conversations",
    "synth api"
  ];
  const { address } = useAccountWagmi();
  const dispatch = useDispatch();
  const [value, setValue] = useState<number>(0);
  const [enabledCurrencies, setEnabledCurrencies] = useState<Erc20[]>([]);
  const [finished, setFinished] = useState<boolean>(false);
  const [currencyDropDown, setCurrencyDropDown] = useState<boolean>(false);
  const [enabledCurrency, setEnabledCurrency] = useState<string>();
  const [accountLoading, setAccountLoading] = useState<boolean>(false);
  const [profileImageUploading, setProfileImageUploading] =
    useState<boolean>(false);
  const [profileLoading, setProfileLoading] = useState<boolean>(false);
  const [coverImageUploading, setCoverImageUploading] =
    useState<boolean>(false);
  const [contentURI, setContentURI] = useState<string | undefined>();
  const [profileImage, setProfileImage] = useState<string | undefined>();
  const [followArgs, setFollowArgs] = useState<any>();
  const [followFee, setFollowFee] = useState<string>("free");
  const [followLoading, setFollowLoading] = useState<boolean>(false);
  const [coverImage, setCoverImage] = useState<string | undefined>();
  const [accountArgs, setAccountArgs] = useState<ProfileArgsType>();
  const [profileImageArgs, setProfileImageArgs] = useState<ImageArgsType>();
  const profile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile
  );
  const coverProfile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.coverPicture
  );
  const followValues = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.followModule
  );
  const dispatcher = useSelector(
    (state: RootState) => state.app.dispatcherReducer.value
  );
  const handleTapeSet = (title: string): void => {
    dispatch(setAccountPage(title));
    if (title === "notifications") {
      dispatch(setNotifications(false));
    }
  };

  const { signTypedDataAsync } = useSignTypedData();

  const { config, isSuccess } = usePrepareContractWrite({
    address: LENS_PERIPHERY_CONTRACT_MUMBAI,
    abi: LensHubPeriphery,
    functionName: "setProfileMetadataURIWithSig",
    enabled: Boolean(accountArgs),
    args: [accountArgs],
  });

  const { writeAsync, error } = useContractWrite(config);

  const { config: profileConfig, isSuccess: profileConfigSuccess } =
    usePrepareContractWrite({
      address: LENS_HUB_PROXY_ADDRESS_MUMBAI,
      abi: LensHubProxy,
      functionName: "setProfileImageURIWithSig",
      enabled: Boolean(profileImageArgs),
      args: [profileImageArgs],
    });

  const { writeAsync: profilewriteAsync, error: writeErrorImage } =
    useContractWrite(profileConfig);

  const { config: followConfig, isSuccess: followConfigSuccess } =
    usePrepareContractWrite({
      address: LENS_HUB_PROXY_ADDRESS_MUMBAI,
      abi: LensHubProxy,
      functionName: "setFollowModuleWithSig",
      enabled: Boolean(followArgs),
      args: [followArgs],
    });

  const { writeAsync: followWriteAsync, error: writeErrorFollow } =
    useContractWrite(followConfig);

  const notificationImages: string[] = [
    "QmZS3Af6ypfwrPYg8w46kjpUR8REGuGb8bj98PukM7yu87",
    "QmZS3Af6ypfwrPYg8w46kjpUR8REGuGb8bj98PukM7yu87",
    "QmZS3Af6ypfwrPYg8w46kjpUR8REGuGb8bj98PukM7yu87",
    "QmZS3Af6ypfwrPYg8w46kjpUR8REGuGb8bj98PukM7yu87",
  ];

  const accountImageUpload = async (e: FormEvent): Promise<void> => {
    let finalImages: string[] = [];
    if ((e as any).target.files.length < 1) {
      return;
    }
    if (fileLimitAlert((e as any).target.files[0])) {
      return;
    }
    if ((e.target as HTMLFormElement).name === "profile") {
      setProfileImageUploading(true);
    } else {
      setCoverImageUploading(true);
    }
    Array.from((e.target as HTMLFormElement).files).map(
      async (file: any, index: number) => {
        try {
          const compressedImage = await compressImageFiles(
            (e.target as HTMLFormElement).files[index]
          );
          const response = await fetch("/api/ipfs", {
            method: "POST",
            body: compressedImage as any,
          });
          if (response.status !== 200) {
            if ((e.target as HTMLFormElement).name === "profile") {
              setProfileImageUploading(false);
            } else {
              setCoverImageUploading(false);
            }
          } else {
            let cid = await response.json();
            finalImages.push(String(cid?.cid));
            if ((e.target as HTMLFormElement).name === "profile") {
              setProfileImage(finalImages[0]);
            } else {
              setCoverImage(finalImages[0]);
            }

            if (
              finalImages?.length ===
              (e.target as HTMLFormElement).files?.length
            ) {
              if ((e.target as HTMLFormElement).name === "profile") {
                setProfileImageUploading(false);
              } else {
                setCoverImageUploading(false);
              }
            }
          }
        } catch (err: any) {
          console.error(err.message);
        }
      }
    );
  };

  const uploadContent = async (e: FormEvent): Promise<string | undefined> => {
    const data: AccountData = {
      name: (e.target as HTMLFormElement).accountName.value
        ? (e.target as HTMLFormElement).accountName.value
        : null,
      bio: (e.target as HTMLFormElement).bio.value
        ? (e.target as HTMLFormElement).bio.value
        : null,
      cover_picture: coverImage
        ? "ipfs://" + coverImage
        : (coverProfile as any)?.original?.url
        ? (coverProfile as any)?.original?.url
        : null,
      attributes: [
        {
          traitType: "string",
          key: "location",
          value: (e.target as HTMLFormElement).location.value
            ? (e.target as HTMLFormElement).location.value
            : "",
        },
        {
          traitType: "string",
          key: "website",
          value: (e.target as HTMLFormElement).website.value
            ? (e.target as HTMLFormElement).website.value
            : "",
        },
      ],
      version: "1.0.0",
      metadata_id: uuidv4(),
      createdOn: new Date(),
      appId: "thedial",
    };

    try {
      const response = await fetch("/api/ipfs", {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (response.status !== 200) {
      } else {
        let responseJSON = await response.json();
        setContentURI(responseJSON.cid);
        return responseJSON.cid;
      }
    } catch (err: any) {
      console.error(err.message);
    }
    return contentURI;
  };

  const setProfileData = async (e: any): Promise<void> => {
    e.preventDefault();
    setAccountLoading(true);
    let result: any;
    try {
      const contentURI = await uploadContent(e);
      if (dispatcher) {
        result = await dispatchProfileMetadata({
          profileId: profile?.id,
          metadata: "ipfs://" + contentURI,
        });
        clearAccount();
        setTimeout(async () => {
          await handleIndexCheck(
            result?.data?.createSetProfileMetadataViaDispatcher?.txHash,
            dispatch,
            false
          );
        }, 7000);
        setFinished(true);
      } else {
        result = await profileMetadata({
          profileId: profile?.id,
          metadata: "ipfs://" + contentURI,
        });

        const typedData: any =
          result.data.createSetProfileMetadataTypedData.typedData;

        const accountSignature: any = await signTypedDataAsync({
          domain: omit(typedData?.domain, ["__typename"]),
          types: omit(typedData?.types, ["__typename"]) as any,
          value: omit(typedData?.value, ["__typename"]) as any,
        });

        const broadcastResult: any = await broadcast({
          id: result?.data?.createSetProfileMetadataTypedData?.id,
          signature: accountSignature,
        });

        if (broadcastResult?.data?.broadcast?.__typename !== "RelayerResult") {
          const {
            v: accountV,
            r: accountR,
            s: accountS,
          } = splitSignature(accountSignature);

          const accountArgs: ProfileArgsType = {
            profileId: typedData.value.profileId,
            metadata: typedData.value.metadata,
            sig: {
              v: accountV,
              r: accountR,
              s: accountS,
              deadline: typedData.value.deadline,
            },
          };

          setAccountArgs(accountArgs);
        } else {
          clearAccount();
          setTimeout(async () => {
            await handleIndexCheck(
              broadcastResult?.data?.broadcast?.txHash,
              dispatch,
              false
            );
          }, 7000);
          setFinished(true);
        }
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setAccountLoading(false);
  };

  const profileImageSet = async (): Promise<void> => {
    setProfileLoading(true);
    let profileImageData: any;
    try {
      if (dispatcher) {
        profileImageData = await dispatchProfileImage({
          profileId: profile?.id,
          url: "ipfs://" + profileImage,
        });
        clearAccount();
        setTimeout(async () => {
          await handleIndexCheck(
            profileImageData?.data?.createSetProfileImageURIViaDispatcher
              ?.txHash,
            dispatch,
            false
          );
        }, 7000);
        setFinished(true);
      } else {
        profileImageData = await profileImageUpload({
          profileId: profile?.id,
          url: "ipfs://" + profileImage,
        });
        const imageTypedData: any =
          profileImageData.data.createSetProfileImageURITypedData.typedData;
        const profileImageSignature: any = await signTypedDataAsync({
          domain: omit(imageTypedData?.domain, ["__typename"]),
          types: omit(imageTypedData?.types, ["__typename"]) as any,
          value: omit(imageTypedData?.value, ["__typename"]) as any,
        });

        const broadcastResult: any = await broadcast({
          id: profileImageData?.data?.createSetProfileImageURITypedData?.id,
          signature: profileImageSignature,
        });

        if (broadcastResult?.data?.broadcast?.__typename !== "RelayerResult") {
          const {
            v: imageV,
            r: imageR,
            s: imageS,
          } = splitSignature(profileImageSignature);

          const profileImageArgsValues: ImageArgsType = {
            profileId: imageTypedData.value.profileId,
            imageURI: imageTypedData.value.imageURI,
            sig: {
              v: imageV,
              r: imageR,
              s: imageS,
              deadline: imageTypedData.value.deadline,
            },
          };

          setProfileImageArgs(profileImageArgsValues);
        } else {
          clearAccount();
          setTimeout(async () => {
            await handleIndexCheck(
              broadcastResult?.data?.broadcast?.txHash,
              dispatch,
              false
            );
          }, 7000);
          setFinished(true);
        }
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setProfileLoading(false);
  };

  const clearAccount = () => {
    dispatch(
      setIndexModal({
        actionValue: true,
        actionMessage: "Indexing Interaction",
      })
    );
  };

  const handleAccountWrite = async (): Promise<void> => {
    setAccountLoading(true);
    try {
      const tx = await writeAsync?.();
      if (error) {
        dispatch(setInsufficientFunds("failed"));
        setAccountLoading(false);
        return;
      }
      clearAccount();
      const res = await tx?.wait();
      await handleIndexCheck(res?.transactionHash, dispatch, true);
    } catch (err) {
      console.error(err);
      setAccountLoading(false);
      dispatch(setInsufficientFunds("failed"));
    }
    setAccountLoading(false);
    setFinished(true);
  };

  const handleProfileImageWrite = async (): Promise<void> => {
    setProfileLoading(true);
    try {
      const tx = await profilewriteAsync?.();
      if (writeErrorImage) {
        dispatch(setInsufficientFunds("failed"));
        setProfileLoading(false);
        return;
      }
      clearAccount();
      const res = await tx?.wait();
      await handleIndexCheck(res?.transactionHash, dispatch, false);
    } catch (err) {
      console.error(err);
      setProfileLoading(false);
      dispatch(setInsufficientFunds("failed"));
    }
    setProfileLoading(false);
    setFinished(true);
  };

  const handleFollowModule = async () => {
    setFollowLoading(true);
    const followModule = createFollowModule(
      followFee,
      value,
      setFollowLoading,
      enabledCurrency,
      address as string,
      false,
      enabledCurrencies
    );
    try {
      const res = await createSetFollowTypedData({
        profileId: profile?.id,
        followModule,
      });
      const typedData: any =
        res?.data?.createSetFollowModuleTypedData.typedData;
      const followSignature: any = await signTypedDataAsync({
        domain: omit(typedData?.domain, ["__typename"]),
        types: omit(typedData?.types, ["__typename"]) as any,
        value: omit(typedData?.value, ["__typename"]) as any,
      });

      const broadcastResult: any = await broadcast({
        id: res?.data?.createSetFollowModuleTypedData?.id,
        signature: followSignature,
      });

      if (broadcastResult?.data?.broadcast?.__typename !== "RelayerResult") {
        const {
          v: followV,
          r: followR,
          s: followS,
        } = splitSignature(followSignature);

        const profileImageArgsValues = {
          followModule: typedData.value.followModule,
          followModuleInitData: typedData.value.followModuleInitData,
          profileId: typedData.value.profileId,
          sig: {
            v: followV,
            r: followR,
            s: followS,
            deadline: typedData.value.deadline,
          },
        };
        setFollowArgs(profileImageArgsValues);
      } else {
        clearAccount();
        setTimeout(async () => {
          await handleIndexCheck(
            broadcastResult?.data?.broadcast?.txHash,
            dispatch,
            false
          );
        }, 7000);
        setFinished(true);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setFollowLoading(false);
  };

  const handleFollowWrite = async () => {
    setFollowLoading(true);
    try {
      const tx = await followWriteAsync?.();
      if (error) {
        dispatch(setInsufficientFunds("failed"));
        setFollowLoading(false);
        return;
      }
      clearAccount();
      const res = await tx?.wait();
      await handleIndexCheck(res?.transactionHash, dispatch, false);
    } catch (err) {
      console.error(err);
      setFollowLoading(false);
      dispatch(setInsufficientFunds("failed"));
    }
    setFollowLoading(false);
    setFinished(true);
  };

  useEffect(() => {
    if (followConfigSuccess) {
      handleFollowWrite();
    }
  }, [followConfigSuccess]);

  useEffect(() => {
    if (isSuccess) {
      handleAccountWrite();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (profileConfigSuccess) {
      handleProfileImageWrite();
    }
  }, [profileConfigSuccess]);

  useMemo(() => {
    if (followFee === "fee") {
      availableCurrencies(
        setEnabledCurrencies,
        setEnabledCurrency,
        (followValues as any)?.amount?.asset?.symbol
      );
    }
  }, [followFee]);

  const resetProfile = async () => {
    try {
      setFinished(false);
      const profile = await getDefaultProfile(address);
      dispatch(setLensProfile(profile?.data?.defaultProfile));
      if (
        profile?.data?.defaultProfile?.followModule?.type === "FeeFollowModule"
      ) {
        setFollowFee("fee");
        setEnabledCurrency(
          profile?.data?.defaultProfile?.followModule?.amount?.asset?.symbol.toLowerCase()
        );
        setValue(profile?.data?.defaultProfile?.followModule?.amount?.value);
      } else if (
        profile?.data?.defaultProfile?.followModule?.type ===
        "RevertFollowModule"
      ) {
        setFollowFee("revert");
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    resetProfile();
  }, [followValues, profile, finished]);

  return {
    accountTitles,
    handleTapeSet,
    notificationImages,
    profileImage,
    coverImage,
    accountImageUpload,
    profileImageUploading,
    coverImageUploading,
    accountLoading,
    setProfileData,
    profileImageSet,
    profileLoading,
    handleFollowModule,
    followLoading,
    setFollowFee,
    followFee,
    value,
    setValue,
    enabledCurrencies,
    setEnabledCurrency,
    currencyDropDown,
    setCurrencyDropDown,
    enabledCurrency,
  };
};

export default useAccount;
