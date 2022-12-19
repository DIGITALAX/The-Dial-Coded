import { FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAccountPage } from "../../../../../redux/reducers/accountPageSlice";
import {
  AccountData,
  ImageArgsType,
  ProfileArgsType,
  UseAccountResult,
} from "../types/account.types";
import { v4 as uuidv4 } from "uuid";
import profileMetadata from "../../../../../graphql/mutations/profileMetadata";
import { RootState } from "../../../../../redux/store";
import { omit, splitSignature } from "../../../../../lib/lens/helpers";
import {
  useContractWrite,
  usePrepareContractWrite,
  useSignTypedData,
  useSignTypedData as useProfileSignTypedData,
  usePrepareContractWrite as useProfilePrepareContractWrite,
  useContractWrite as useProfileContractWrite,
  useAccount as useAccountWagmi,
} from "wagmi";
import {
  LENS_HUB_PROXY_ADDRESS_MUMBAI,
  LENS_PERIPHERY_CONTRACT_MUMBAI,
} from "../../../../../lib/lens/constants";
import LensHubProxy from "./../../../../../abis/LensHubProxy.json";
import LensHubPeriphery from "./../../../../../abis/LensPeriphery.json";
import profileImageUpload from "../../../../../graphql/mutations/profileImage";
import getDefaultProfile from "../../../../../graphql/queries/getDefaultProfile";
import { setLensProfile } from "../../../../../redux/reducers/lensProfileSlice";
import checkIndexed from "../../../../../graphql/queries/checkIndexed";

const useAccount = (): UseAccountResult => {
  const accountTitles: string[] = ["account", "profile feed", "stats"];
  const dispatch = useDispatch();
  const { address } = useAccountWagmi();
  const [accountLoading, setAccountLoading] = useState<boolean>(false);
  const [profileImageUploading, setProfileImageUploading] =
    useState<boolean>(false);
  const [profileLoading, setProfileLoading] = useState<boolean>(false);
  const [coverImageUploading, setCoverImageUploading] =
    useState<boolean>(false);
  const [contentURI, setContentURI] = useState<string | undefined>();
  const [profileImage, setProfileImage] = useState<string | undefined>();
  const [coverImage, setCoverImage] = useState<string | undefined>();
  const [accountArgs, setAccountArgs] = useState<ProfileArgsType>();
  const [profileImageArgs, setProfileImageArgs] = useState<ImageArgsType>();
  const profileId = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.id
  );
  const coverProfile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.coverPicture
  );
  const handleTapeSet = (title: string): void => {
    dispatch(setAccountPage(title));
  };
  const {
    signTypedDataAsync,
    isSuccess: signedSuccess,
    error: signedError,
  } = useSignTypedData();
  const { signTypedDataAsync: signProfileTypedDataAsync } =
    useProfileSignTypedData();
  const {
    config,
    isSuccess,
    error: configerror,
  } = usePrepareContractWrite({
    address: LENS_PERIPHERY_CONTRACT_MUMBAI,
    abi: LensHubPeriphery,
    functionName: "setProfileMetadataURIWithSig",
    enabled: Boolean(accountArgs),
    args: [accountArgs],
  });

  const { writeAsync } = useProfileContractWrite(config);

  const { config: profileConfig, isSuccess: profileConfigSuccess } =
    useProfilePrepareContractWrite({
      address: LENS_HUB_PROXY_ADDRESS_MUMBAI,
      abi: LensHubProxy,
      functionName: "setProfileImageURIWithSig",
      enabled: Boolean(profileImageArgs),
      args: [profileImageArgs],
    });

  const { writeAsync: profilewriteAsync } = useContractWrite(profileConfig);

  const notificationImages: string[] = [
    "QmZS3Af6ypfwrPYg8w46kjpUR8REGuGb8bj98PukM7yu87",
    "QmZS3Af6ypfwrPYg8w46kjpUR8REGuGb8bj98PukM7yu87",
    "QmZS3Af6ypfwrPYg8w46kjpUR8REGuGb8bj98PukM7yu87",
    "QmZS3Af6ypfwrPYg8w46kjpUR8REGuGb8bj98PukM7yu87",
  ];

  const accountImageUpload = async (e: FormEvent): Promise<void> => {
    let finalImages: string[] = [];

    if ((e.target as HTMLFormElement).name === "profile") {
      setProfileImageUploading(true);
    } else {
      setCoverImageUploading(true);
    }
    Array.from((e.target as HTMLFormElement).files).map(
      async (file: any, index: number) => {
        try {
          const response = await fetch("/api/ipfs", {
            method: "POST",
            body: (e.target as HTMLFormElement).files[index],
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
    try {
      const contentURI = await uploadContent(e);
      const result: any = await profileMetadata({
        profileId: profileId,
        metadata: "https://thedial.infura-ipfs.io/ipfs/" + contentURI,
      });

      const typedData: any =
        result.data.createSetProfileMetadataTypedData.typedData;

      const accountSignature: any = await signTypedDataAsync({
        domain: omit(typedData?.domain, ["__typename"]),
        types: omit(typedData?.types, ["__typename"]) as any,
        value: omit(typedData?.value, ["__typename"]) as any,
      });

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
    } catch (err: any) {
      console.error(err.message);
    }
    setAccountLoading(false);
  };

  const profileImageSet = async (): Promise<void> => {
    setProfileLoading(true);
    try {
      const profileImageData: any = await profileImageUpload({
        profileId: profileId,
        url: "ipfs://" + profileImage,
      });
      const imageTypedData: any =
        profileImageData.data.createSetProfileImageURITypedData.typedData;
      const profileImageSignature: any = await signProfileTypedDataAsync({
        domain: omit(imageTypedData?.domain, ["__typename"]),
        types: omit(imageTypedData?.types, ["__typename"]) as any,
        value: omit(imageTypedData?.value, ["__typename"]) as any,
      });

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
    } catch (err: any) {
      console.error(err.message);
    }
    setProfileLoading(false);
  };

  const handleAccountWrite = async (): Promise<void> => {
    setAccountLoading(true);
    try {
      const tx = await writeAsync?.();
      const res = await tx?.wait();
      if (res?.transactionHash === undefined) {
        alert("Transaction Failed. Please Try Again.");
        setAccountLoading(false);
      } else {
        setTimeout(async () => {
          const result = await checkIndexed(res?.transactionHash);
          if (result?.data?.hasTxHashBeenIndexed?.indexed) {
            setAccountLoading(false);
            const profile = await getDefaultProfile(address);
            dispatch(setLensProfile(profile.data.defaultProfile));
          }
        }, 10000);
      }
    } catch (err) {
      console.error(err);
      setAccountLoading(false);
      alert("Transaction Failed. Please Try Again.");
    }
  };

  const handleProfileImageWrite = async (): Promise<void> => {
    setProfileLoading(true);
    try {
      const tx = await profilewriteAsync?.();
      const res = await tx?.wait();
      if (res?.transactionHash === undefined) {
        alert("Transaction Failed. Please Try Again.");
        setProfileLoading(false);
      } else {
        setTimeout(async () => {
          setProfileLoading(false);
        }, 6000);
      }
    } catch (err) {
      console.error(err);
      setProfileLoading(false);
      alert("Transaction Failed. Please Try Again.");
    }
  };

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
  };
};

export default useAccount;
