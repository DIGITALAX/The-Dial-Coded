import { splitSignature } from "ethers/lib/utils.js";
import { omit } from "lodash";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useContractWrite as useContractMirrorWrite,
  useContractWrite as useContractCommentWrite,
  useContractWrite as useContractReactWrite,
  useContractWrite as useContractCollectWrite,
  usePrepareContractWrite as usePrepareContractMirrorWrite,
  usePrepareContractWrite as usePrepareContractCommentWrite,
  usePrepareContractWrite as usePrepareContractCollectWrite,
  usePrepareContractWrite as usePrepareContractReactWrite,
  useSignTypedData,
  useSendTransaction,
  usePrepareSendTransaction,
  useAccount,
  useWaitForTransaction,
} from "wagmi";
import mirror from "../../../../graphql/mutations/mirror";
import whoCollectedPublications from "../../../../graphql/queries/whoCollectPublications";
import whoCommentedPublications from "../../../../graphql/queries/whoCommentedPublications";
import whoMirroredPublications from "../../../../graphql/queries/whoMirroredPublications";
import whoReactedublications from "../../../../graphql/queries/whoReactedPublication";
import { LENS_HUB_PROXY_ADDRESS_MUMBAI } from "../../../../lib/lens/constants";
import { RootState } from "../../../../redux/store";
import { PostImage, UseReactionsResult } from "../../types/common.types";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import {
  PaginatedResultInfo,
  ProfileQueryRequest,
  PublicationsQueryRequest,
  WhoCollectedPublicationRequest,
} from "../../types/lens.types";
import LensHubProxy from "./../../../../abis/LensHubProxy.json";
import {
  addReaction,
  removeReaction,
} from "../../../../graphql/mutations/react";
import { setReactionState } from "../../../../redux/reducers/reactionStateSlice";
import lodash from "lodash";
import CreateCommentTypedData from "../../../../graphql/mutations/comment";
import collect from "../../../../graphql/mutations/collect";
import { setInsufficientFunds } from "../../../../redux/reducers/insufficientFunds";
import { setSignIn } from "../../../../redux/reducers/signInSlice";
import { useRouter } from "next/router";
import checkIndexed from "../../../../graphql/queries/checkIndexed";

const useReactions = (): UseReactionsResult => {
  const {
    query: { id },
  } = useRouter();
  const pubId = useSelector(
    (state: RootState) => state.app.reactionStateReducer.value
  );
  const approvalArgs = useSelector(
    (state: RootState) => state.app.approvalArgsReducer.args
  );
  const reactions = useSelector(
    (state: RootState) => state.app.reactionStateReducer
  );
  const commentShow = useSelector(
    (state: RootState) => state.app.commentShowReducer.open
  );
  const commentId = useSelector(
    (state: RootState) => state.app.commentShowReducer.value
  );
  const postImages = useSelector(
    (state: RootState) => state?.app?.postImageReducer?.value
  );
  const collectModuleType = useSelector(
    (state: RootState) => state?.app?.collectValueTypeReducer?.type
  );
  const [mirrorArgs, setMirrorArgs] = useState<any>();
  const [commentArgs, setCommentArgs] = useState<any>();
  const [collectArgs, setCollectArgs] = useState<any>();
  const [collectors, setCollectors] = useState<
    WhoCollectedPublicationRequest[]
  >([]);
  const dispatch = useDispatch();
  const [mirrorLoading, setMirrorLoading] = useState<boolean>(false);
  const [collectPageInfo, setCollectPageInfo] = useState<PaginatedResultInfo>();
  const [mirrorPageInfo, setMirrorPageInfo] = useState<PaginatedResultInfo>();
  const [mirrorers, setMirrorers] = useState<ProfileQueryRequest[]>([]);
  const [commentors, setCommentors] = useState<PublicationsQueryRequest[]>([]);
  const [commentPageInfo, setCommentPageInfo] = useState<PaginatedResultInfo>();
  const [reactionLoading, setReactionLoading] = useState<boolean>(false);
  const [reacters, setReacters] = useState<any>([]);
  const [collectLoading, setCollectLoading] = useState<boolean>(false);
  const [approvalLoading, setApprovalLoading] = useState<boolean>(false);
  const [commentLoading, setCommentLoading] = useState<boolean>(false);
  const [gifs, setGifs] = useState<string[]>([]);
  const [contentURI, setContentURI] = useState<string | undefined>();
  const [commentDescription, setCommentDescription] = useState<string>("");
  const [results, setResults] = useState<any>([]);
  const [searchGif, setSearchGif] = useState<string | undefined>();
  const [reactionPageInfo, setReactionPageInfo] =
    useState<PaginatedResultInfo>();
  const defaultProfile = useSelector(
    (state: RootState) => state?.app?.lensProfileReducer?.profile?.id
  );
  const [approvalSendEnabled, setApprovalSendEnabled] =
    useState<boolean>(false);
  const {
    config: approvalConfig,
    error: configerror,
    isSuccess: approvalConfigSuccess,
  } = usePrepareSendTransaction({
    request: {
      to: approvalArgs?.to as string,
      from: approvalArgs?.from as string,
      data: approvalArgs?.data as string,
    },
    // enabled: Boolean(approvalSendEnabled),
  });
  const {
    sendTransactionAsync,
    isSuccess: approvalSuccess,
    error,
    data,
  } = useSendTransaction(approvalConfig);

  const {} = useWaitForTransaction();

  const { address } = useAccount();

  const { signTypedDataAsync } = useSignTypedData();

  const getPostCollects = async (): Promise<void> => {
    try {
      const collects = await whoCollectedPublications({
        publicationId: id ? id : pubId,
        limit: 30,
      });
      const arr: any[] = [...collects.data.whoCollectedPublication.items];
      const sortedArr: any[] = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      setCollectors(sortedArr);
      setCollectPageInfo(collects?.data.whoCollectedPublication.pageInfo);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getMorePostCollects = async (): Promise<void> => {
    try {
      const collects = await whoCollectedPublications({
        publicationId: id ? id : pubId,
        limit: 30,
        cursor: collectPageInfo?.next,
      });
      const arr: any[] = [...collects.data.whoCollectedPublication.items];
      const sortedArr: any[] = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      setCollectors([...collectors, ...sortedArr]);
      setCollectPageInfo(collects?.data.whoCollectedPublication.pageInfo);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getReactions = async (): Promise<void> => {
    try {
      const reactions = await whoReactedublications({
        publicationId: id ? id : pubId,
      });
      const upvoteArr = lodash.filter(
        reactions?.data?.whoReactedPublication.items,
        (item) => item.reaction === "UPVOTE"
      );
      const arr: any[] = [...upvoteArr];
      const sortedArr: any[] = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      setReacters(sortedArr);
      setReactionPageInfo(reactions?.data?.whoReactedPublication?.pageInfo);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getMorePostReactions = async (): Promise<void> => {
    try {
      const reactions = await whoReactedublications({
        publicationId: id ? id : pubId,
        cursor: reactionPageInfo?.next,
      });
      const arr: any[] = [...reactions?.data?.whoReactedPublication?.items];
      const sortedArr: any[] = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      setReacters([...reacters, ...sortedArr]);
      setReactionPageInfo(reactions?.data.profiles.pageInfo);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getPostMirrors = async (): Promise<void> => {
    try {
      const mirrors = await whoMirroredPublications({
        whoMirroredPublicationId: id ? id : pubId,
        limit: 30,
      });
      const arr: any[] = [...mirrors.data.profiles.items];
      const sortedArr: any[] = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      setMirrorers(sortedArr);
      setMirrorPageInfo(mirrors?.data.profiles.pageInfo);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getMorePostMirrors = async (): Promise<void> => {
    try {
      const mirrors = await whoMirroredPublications({
        whoMirroredPublicationId: id ? id : pubId,
        limit: 30,
        cursor: mirrorPageInfo?.next,
      });
      const arr: any[] = [...mirrors.data.profiles.items];
      const sortedArr: any[] = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      setMirrorers([...mirrorers, ...sortedArr]);
      setMirrorPageInfo(mirrors?.data.profiles.pageInfo);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getPostComments = async (id?: string): Promise<void> => {
    try {
      const comments = await whoCommentedPublications({
        commentsOf: id ? id : commentId,
        limit: 30,
      });
      const arr: any[] = [...comments.data.publications.items];
      const sortedArr: any[] = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      setCommentors(sortedArr);
      setCommentPageInfo(comments.data.publications.pageInfo);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getMorePostComments = async (id?: string): Promise<void> => {
    try {
      const comments = await whoCommentedPublications({
        commentsOf: id ? id : commentId,
        limit: 30,
        cursor: commentPageInfo?.next,
      });
      const arr: any[] = [...comments.data.publications.items];
      const sortedArr: any[] = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      setCommentors([...commentors, ...sortedArr]);
      setCommentPageInfo(comments.data.publications.pageInfo);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const { config: mirrorConfig, isSuccess: mirrorSuccess } =
    usePrepareContractMirrorWrite({
      address: LENS_HUB_PROXY_ADDRESS_MUMBAI,
      abi: LensHubProxy,
      functionName: "mirrorWithSig",
      enabled: Boolean(mirrorArgs),
      args: [mirrorArgs],
    });

  const { writeAsync: mirrorWriteAsync, isSuccess: mirrorComplete } =
    useContractMirrorWrite(mirrorConfig);

  const { config: collectConfig, isSuccess: collectSuccess } =
    usePrepareContractCollectWrite({
      address: LENS_HUB_PROXY_ADDRESS_MUMBAI,
      abi: LensHubProxy,
      functionName: "collectWithSig",
      enabled: Boolean(collectArgs),
      args: [collectArgs],
    });

  const { writeAsync: collectWriteAsync, isSuccess: collectComplete } =
    useContractCollectWrite(collectConfig);

  const mirrorPost = async (): Promise<void> => {
    setMirrorLoading(true);
    try {
      const mirrorPost = await mirror({
        profileId: defaultProfile,
        publicationId: id ? id : pubId,
        referenceModule: {
          followerOnlyReferenceModule: false,
        },
      });

      const typedData: any = mirrorPost.data.createMirrorTypedData.typedData;
  
      const signature: any = await signTypedDataAsync({
        domain: omit(typedData?.domain, ["__typename"]),
        types: omit(typedData?.types, ["__typename"]) as any,
        value: omit(typedData?.value, ["__typename"]) as any,
      });

      const { v, r, s } = splitSignature(signature);
      const mirrorArgs = {
        profileId: typedData.value.profileId,
        profileIdPointed: typedData.value.profileIdPointed,
        pubIdPointed: typedData.value.pubIdPointed,
        referenceModuleData: typedData.value.referenceModuleData,
        referenceModule: typedData.value.referenceModule,
        referenceModuleInitData: typedData.value.referenceModuleInitData,
        sig: {
          v,
          r,
          s,
          deadline: typedData.value.deadline,
        },
      };
      setMirrorArgs(mirrorArgs);
    } catch (err: any) {
      console.error(err.message);
      dispatch(setInsufficientFunds("failed"));
    }
    setMirrorLoading(false);
  };

  const reactionPost = async (): Promise<void> => {
    setReactionLoading(true);
    const voteWay = lodash.filter(
      reacters,
      (item) => item?.profile?.id == defaultProfile
    );
    try {
      if (voteWay.length === 0 || voteWay[0]?.reaction === "DOWNVOTE") {
        const add = await addReaction({
          profileId: defaultProfile,
          reaction: "UPVOTE",
          publicationId: id ? id : pubId,
        });
      } else {
        const remove = await removeReaction({
          profileId: defaultProfile,
          reaction: "DOWNVOTE",
          publicationId: id ? id : pubId,
        });
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setReactionLoading(false);
    dispatch(
      setReactionState({
        actionOpen: false,
        actionType: "heart",
        actionValue: id ? id : pubId,
      })
    );
  };

  const collectPost = async (): Promise<void> => {
    setCollectLoading(true);
    try {
      const collectPost = await collect({
        publicationId: id ? id : pubId,
      });
      const typedData: any = collectPost.data.createCollectTypedData.typedData;
      const signature: any = await signTypedDataAsync({
        domain: omit(typedData?.domain, ["__typename"]),
        types: omit(typedData?.types, ["__typename"]) as any,
        value: omit(typedData?.value, ["__typename"]) as any,
      });
      const { v, r, s } = splitSignature(signature);
      const collectArgs = {
        collector: address,
        profileId: typedData.value.profileId,
        pubId: typedData.value.pubId,
        data: typedData.value.data,
        sig: {
          v,
          r,
          s,
          deadline: typedData.value.deadline,
        },
      };
      setCollectArgs(collectArgs);
    } catch (err: any) {
      console.error(err.message);
      if (
        err.message.includes(
          "You do not have enough allowance to collect this publication."
        )
      ) {
        dispatch(setInsufficientFunds("insufficient"));
      }
    }
    setCollectLoading(false);
  };

  const callApprovalSign = async (): Promise<void> => {
    try {
      const tx = await sendTransactionAsync?.();
      await tx?.wait();
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

  const handleEmoji = (e: any): void => {
    setCommentDescription(commentDescription + e.emoji);
  };

  const handleGif = (e: FormEvent): void => {
    setSearchGif((e.target as HTMLFormElement).value);
  };

  const handleGifSubmit = async (e: any): Promise<void> => {
    const getGifs = await fetch("/api/giphy", {
      method: "POST",
      body: JSON.stringify(searchGif),
    });
    const allGifs = await getGifs.json();
    setResults(allGifs?.json?.results);
  };

  const handleSetGif = (result: any) => {
    setGifs([...gifs, result]);
  };

  const handleRemoveGif = (result: any) => {
    const filtered: string[] = lodash.filter(gifs, (gif) => gif !== result);
    setGifs(filtered);
  };

  const { config: commentConfig, isSuccess: commentSuccess } =
    usePrepareContractCommentWrite({
      address: LENS_HUB_PROXY_ADDRESS_MUMBAI,
      abi: LensHubProxy,
      functionName: "commentWithSig",
      enabled: Boolean(commentArgs),
      args: [commentArgs],
    });

  const { writeAsync: commentWriteAsync, isSuccess: commentComplete } =
    useContractCommentWrite(commentConfig);

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

    // let formattedHashtags: string[] | undefined = hashtags?.split(/(\s+)/);
    // console.log(formattedHashtags)
    // formattedHashtags = lodash.filter(formattedHashtags, (hashtag) => hashtag !== "")
    // console.log(formattedHashtags)
    // if (hashtags?.length > 0) {
    //   console.log(hashtags);
    //   const firstFive = lodash.slice(hashtags, 0, 4);
    //   for (let i = 0; i < firstFive.length; i++) {
    //     if (firstFive[i].length < 50) formattedHashtags.push(firstFive[i]);
    //   }
    // console.log(formattedHashtags);
    // }

    const data = {
      version: "2.0.0",
      metadata_id: uuidv4(),
      description: commentDescription ? commentDescription : "",
      content: commentDescription ? commentDescription : "",
      external_url: "https://www.thedial.xyz/",
      image:
        postImages && postImages?.length > 0 ? "ipfs://" + postImages[0] : null,
      imageMimeType: "image/png",
      name: commentDescription ? commentDescription?.slice(0, 20) : "The Dial",
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
      postTags: null,
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

  const commentPost = async (e: FormEvent): Promise<void> => {
    setCommentLoading(true);
    try {
      const contentURI = await uploadContent();
      const result: any = await CreateCommentTypedData({
        profileId: defaultProfile,
        publicationId: id ? id : pubId,
        contentURI: "ipfs://" + contentURI,
        collectModule: collectModuleType,
        referenceModule: {
          followerOnlyReferenceModule: false,
        },
      });

      const typedData: any = result.data.createCommentTypedData.typedData;

      const signature: any = await signTypedDataAsync({
        domain: omit(typedData?.domain, ["__typename"]),
        types: omit(typedData?.types, ["__typename"]) as any,
        value: omit(typedData?.value, ["__typename"]) as any,
      });

      const { v, r, s } = splitSignature(signature);

      const commentArgs = {
        profileId: typedData.value.profileId,
        contentURI: typedData.value.contentURI,
        profileIdPointed: typedData.value.profileIdPointed,
        pubIdPointed: typedData.value.pubIdPointed,
        referenceModuleData: typedData.value.referenceModuleData,
        referenceModule: typedData.value.referenceModule,
        referenceModuleInitData: typedData.value.referenceModuleInitData,
        collectModule: typedData.value.collectModule,
        collectModuleInitData: typedData.value.collectModuleInitData,
        sig: {
          v,
          r,
          s,
          deadline: typedData.value.deadline,
        },
      };
      setCommentArgs(commentArgs);
    } catch (err: any) {
      console.error(err.message);
      dispatch(setInsufficientFunds("failed"));
    }
    setCommentLoading(false);
  };

  const handleCommentDescription = (e: FormEvent): void => {
    setCommentDescription((e.target as HTMLFormElement).value);
  };

  const commentWrite = async (): Promise<void> => {
    setCommentLoading(true);
    try {
      const tx = await commentWriteAsync?.();
      const res = await tx?.wait();
      if (res?.transactionHash === undefined) {
        dispatch(setInsufficientFunds("failed"))
        setCommentLoading(false);
      } else {
        const result = await checkIndexed(res?.transactionHash);
        if (result?.data?.hasTxHashBeenIndexed?.indexed) {
          setCommentLoading(false);
          setCommentDescription("");
        }
      }
    } catch (err) {
      console.error(err);
      setCommentLoading(false);
      dispatch(setInsufficientFunds("failed"))
    }
  };

  const mirrorWrite = async (): Promise<void> => {
    setMirrorLoading(true);
    try {
      const tx = await mirrorWriteAsync?.();
      dispatch(
        setReactionState({
          actionOpen: false,
          actionType: "mirror",
          actionValue: id ? id : pubId,
        })
      );
      const res = await tx?.wait();
    } catch (err: any) {
      dispatch(setInsufficientFunds("failed"));
      console.error(err.message);
    }
    setMirrorLoading(false);
  };

  const collectWrite = async (): Promise<void> => {
    setCollectLoading(true);
    try {
      const tx = await collectWriteAsync?.();
      const res = await tx?.wait();
      setCollectLoading(false);
      dispatch(
        setReactionState({
          actionOpen: false,
          actionType: "collect",
          actionValue: id ? id : pubId,
        })
      );
    } catch (err: any) {
      console.error(err.message);
      setCollectLoading(false);
      dispatch(setInsufficientFunds("failed"));
    }
  };

  useEffect(() => {
    if (commentShow) {
      getPostComments();
    }

    if (reactions.type === "heart") {
      getReactions();
    }

    if (reactions.type === "mirror") {
      getPostMirrors();
    }

    if (reactions.type === "collect") {
      getPostCollects();
    }
  }, [reactions.type, reactions.open, id, commentShow, pubId]);

  useEffect(() => {
    if (mirrorSuccess) {
      mirrorWrite();
    }

    if (collectSuccess) {
      collectWrite();
    }

    if (commentSuccess) {
      commentWrite();
    }
  }, [mirrorSuccess, collectSuccess, commentSuccess]);

  return {
    collectors,
    mirrorers,
    commentors,
    reacters,
    getMorePostMirrors,
    getMorePostComments,
    getMorePostCollects,
    getMorePostReactions,
    mirrorPost,
    reactionPost,
    mirrorLoading,
    reactionLoading,
    mirrorComplete,
    collectComplete,
    approvalSuccess,
    approvalLoading,
    collectLoading,
    approveCurrency,
    collectPost,
    commentPost,
    commentLoading,
    getPostComments,
    handleCommentDescription,
    commentDescription,
    handleGif,
    handleSetGif,
    results,
    searchGif,
    handleGifSubmit,
    handleEmoji,
  };
};

export default useReactions;
