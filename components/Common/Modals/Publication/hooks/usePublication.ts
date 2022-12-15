import { FormEvent, useState } from "react";
import {
  useContractWrite,
  usePrepareContractWrite,
  useSignTypedData,
} from "wagmi";
import { LENS_HUB_PROXY_ADDRESS_MUMBAI } from "../../../../../lib/lens/constants";
import LensHubProxy from "./../../../../../abis/LensHubProxy.json";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import { PostArgsType, PostImage } from "../../../types/common.types";
import moment from "moment";
import createPostTypedData from "../../../../../graphql/mutations/createPost";
import { omit, splitSignature } from "../../../../../lib/lens/helpers";
import checkIndexed from "../../../../../graphql/queries/checkIndexed";
import { setPublication } from "../../../../../redux/reducers/publicationSlice";
import { setSignIn } from "../../../../../redux/reducers/signInSlice";
import lodash from "lodash";

const usePublication = () => {
  const [postDescription, setPostDesription] = useState<string>("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [urls, setUrls] = useState<string[]>([]);
  const [postLoading, setPostLoading] = useState<boolean>(false);
  const [contentURI, setContentURI] = useState<string | undefined>();
  const [args, setArgs] = useState<PostArgsType | undefined>();
  const [enabled, setEnabled] = useState<boolean>(false);
  const [searchGif, setSearchGif] = useState<string>();
  const [results, setResults] = useState<any>([]);
  const dispatch = useDispatch();
  const defaultProfile = useSelector(
    (state: RootState) => state?.app?.lensProfileReducer?.profile?.id
  );
  console.log(defaultProfile);
  const { signTypedDataAsync } = useSignTypedData();
  const postImages = useSelector(
    (state: RootState) => state?.app?.postImageReducer?.value
  );
  const collectModuleType = useSelector(
    (state: RootState) => state?.app?.collectValueTypeReducer?.type
  );
  const [gifs, setGifs] = useState<string[]>([]);
  const { config, isSuccess } = usePrepareContractWrite({
    address: LENS_HUB_PROXY_ADDRESS_MUMBAI,
    abi: LensHubProxy,
    functionName: "postWithSig",
    onError(error) {
      console.error("Error", error);
    },
    onSettled(error, data) {
      console.log("Settled", error, data);
    },
    onSuccess(data) {
      console.log("Success", data);
    },
    enabled: Boolean(enabled),
    args: [args],
  });

  const {
    writeAsync,
    error,
    isError,
    data: configData,
  } = useContractWrite(config);
  // const { data: hashData } = useWaitForTransaction({
  //   hash: configData?.hash,
  // });

  const handleEmoji = (e: any): void => {
    setPostDesription(postDescription + e.emoji);
  };

  const handleGif = (e: FormEvent): void => {
    setSearchGif((e.target as HTMLFormElement).value);
  };

  const handleGifSubmit = async (e: any): Promise<void> => {
    console.log("HEERADF");
    const getGifs = await fetch("/api/giphy", {
      method: "POST",
      body: searchGif,
    });
    const gifs = await getGifs.json();
    setResults(gifs?.results?.data);
    setSearchGif("");
  };

  const handleSetGif = (result: any) => {
    setGifs([...gifs, result]);
  };

  const handleRemoveGif = (result: any) => {
    const filtered: string[] = lodash.filter(gifs, (gif) => gif !== result);
    setGifs(filtered);
  };

  const uploadContent = async (): Promise<string | undefined> => {
    let newImages: PostImage[] = [];
    postImages?.forEach((image) => {
      newImages.push({
        item: "ipfs://" + image,
        type: "image/png",
        altTag: image,
      });
    });

    if (gifs.length > 0) {
      for (let i = 0; i < gifs.length; i++) {
        newImages.push({
          item: gifs[i],
          type: "image/gif",
          altTag: gifs[i],
        });
      }
    }

    let formattedHashtags: string[];
    if (hashtags?.length > 0) {

    }

    const data = {
      version: "2.0.0",
      metadata_id: uuidv4(),
      description: postDescription ? postDescription : "",
      content: postDescription ? postDescription : "",
      external_url: "https://www.thedial.xyz/",
      image:
        postImages && postImages?.length > 0 ? "ipfs://" + postImages[0] : null,
      imageMimeType: "image/png",
      name: postDescription ? postDescription?.slice(0, 20) : "The Dial",
      mainContentFocus:
        newImages.length > 0 || gifs.length > 0 ? "IMAGE" : "TEXT_ONLY",
      contentWarning: null,
      attributes: [
        {
          traitType: "string",
          key: "date",
          date: moment().format("MM/D hh:mm:ss"),
        },
      ],
      media: newImages,
      locale: "en",
      postTags: hashtags ? hashtags : null,
      createdOn: new Date(),
      appId: "thedial",
    };

    try {
      const response = await fetch("/api/ipfs", {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (response.status !== 200) {
        console.log("ERROR", response);
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

  const handlePost = async (): Promise<void> => {
    setPostLoading(true);
    try {
      const contentURI = await uploadContent();
      const result: any = await createPostTypedData({
        profileId: defaultProfile,
        contentURI: "ipfs://" + contentURI,
        collectModule: collectModuleType,
        referenceModule: {
          followerOnlyReferenceModule: false,
        },
      });

      const typedData: any = result.data.createPostTypedData.typedData;

      const signature: any = await signTypedDataAsync({
        domain: omit(typedData?.domain, ["__typename"]),
        types: omit(typedData?.types, ["__typename"]) as any,
        value: omit(typedData?.value, ["__typename"]) as any,
      });

      const { v, r, s } = splitSignature(signature);

      const postArgs: PostArgsType = {
        profileId: typedData.value.profileId,
        contentURI: typedData.value.contentURI,
        collectModule: typedData.value.collectModule,
        collectModuleInitData: typedData.value.collectModuleInitData,
        referenceModule: typedData.value.referenceModule,
        referenceModuleInitData: typedData.value.referenceModuleInitData,
        sig: {
          v,
          r,
          s,
          deadline: typedData.value.deadline,
        },
      };
      setArgs(postArgs);
      setEnabled(true);
    } catch (err: any) {
      console.error(err.message);
      dispatch(setSignIn(true));
    }
    setPostLoading(false);
  };

  const handlePostWrite = async (): Promise<void> => {
    setPostLoading(true);
    try {
      const tx = await writeAsync?.();
      const res = await tx?.wait();
      if (res?.transactionHash === undefined) {
        alert("Transaction Failed. Please Try Again.");
        setPostLoading(false);
      } else {
        setTimeout(async () => {
          const result = await checkIndexed(res?.transactionHash);
          if (result?.data?.hasTxHashBeenIndexed?.indexed) {
            setPostLoading(false);
            dispatch(setPublication(false));
            setEnabled(false);
            setPostDesription("");
          }
        }, 10000);
      }
    } catch (err) {
      console.error(err);
      setPostLoading(false);
      alert("Transaction Failed. Please Try Again.");
    }
  };

  const handlePostDescription = (e: FormEvent): void => {
    setPostDesription((e.target as HTMLFormElement).value);
    if ((e.target as HTMLFormElement).value.match(/\B#\w*[a-zA-Z]+\w*/)) {
      setHashtags([
        ...hashtags,
        (e.target as HTMLFormElement).value.match(/\B#\w*[a-zA-Z]+\w*/)[0],
      ]);
    }

    if (
      (e.target as HTMLFormElement).value.match(
        /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/
      )
    ) {
      setUrls([
        ...urls,
        (e.target as HTMLFormElement).value.match(
          /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/
        )[0],
      ]);
    }
  };

  return {
    handlePost,
    postDescription,
    handlePostDescription,
    hashtags,
    urls,
    handleEmoji,
    postLoading,
    handlePostWrite,
    isSuccess,
    searchGif,
    results,
    handleGif,
    handleGifSubmit,
    handleSetGif,
    gifs,
    handleRemoveGif,
  };
};

export default usePublication;
