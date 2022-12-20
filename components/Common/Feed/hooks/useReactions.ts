import { splitSignature } from "ethers/lib/utils.js";
import { omit } from "lodash";
import { useEffect, useMemo, useState } from "react";
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
import { UseReactionsResult } from "../../types/common.types";
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
import comment from "../../../../graphql/mutations/comment";
import collect from "../../../../graphql/mutations/collect";
import { setInsufficientFunds } from "../../../../redux/reducers/insufficientFunds";

const useReactions = (): UseReactionsResult => {
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
        publicationId: pubId,
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
        publicationId: pubId,
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
        publicationId: pubId,
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
        publicationId: pubId,
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
        whoMirroredPublicationId: pubId,
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
        whoMirroredPublicationId: pubId,
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

  const getPostComments = async (): Promise<void> => {
    try {
      const comments = await whoCommentedPublications({
        commentsOf: commentId,
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

  const getMorePostComments = async (): Promise<void> => {
    try {
      const comments = await whoCommentedPublications({
        commentsOf: commentId,
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
    console.log("here in the function")
    try {
      const mirrorPost = await mirror({
        profileId: defaultProfile,
        publicationId: pubId,
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
        await addReaction({
          profileId: defaultProfile,
          reaction: "UPVOTE",
          publicationId: pubId,
        });
      } else {
        await removeReaction({
          profileId: defaultProfile,
          reaction: "DOWNVOTE",
          publicationId: pubId,
        });
      }
      dispatch(
        setReactionState({
          actionOpen: false,
          actionType: "heart",
          actionValue: pubId,
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setReactionLoading(false);
  };

  const collectPost = async (): Promise<void> => {
    setCollectLoading(true);
    try {
      const collectPost = await collect({
        publicationId: pubId,
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

  const commentPost = async (): Promise<void> => {
    setCommentLoading(true);
    try {
      const commentPost = await comment({
        profileId: defaultProfile,
        publicationId: pubId,
        contentURI: "ipfs://QmPogtffEF3oAbKERsoR4Ky8aTvLgBF5totp5AuF8YN6vl",
        collectModule: {
          revertCollectModule: true,
        },
        referenceModule: {
          followerOnlyReferenceModule: false,
        },
      });
      const typedData: any = commentPost.data.createMirrorTypedData.typedData;

      const signature: any = await signTypedDataAsync({
        domain: omit(typedData?.domain, ["__typename"]),
        types: omit(typedData?.types, ["__typename"]) as any,
        value: omit(typedData?.value, ["__typename"]) as any,
      });

      const { v, r, s } = splitSignature(signature);
      const commentArgs = {
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
      setCommentArgs(commentArgs);
    } catch (err: any) {
      console.error(err.message);
    }
    setCommentLoading(false);
  };

  const commentWrite = async (): Promise<void> => {};

  const mirrorWrite = async (): Promise<void> => {
    try {
      const tx = await mirrorWriteAsync?.();
      dispatch(
        setReactionState({
          actionOpen: false,
          actionType: "mirror",
          actionValue: pubId,
        })
      );
      const res = await tx?.wait();
    } catch (err: any) {
      console.error(err.message);
    }
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
          actionValue: pubId,
        })
      );
    } catch (err: any) {
      console.error(err.message);
      setCollectLoading(false);
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
  }, [reactions.type, reactions.open, pubId, commentShow]);

  useEffect(() => {
    if (mirrorSuccess) {
      mirrorWrite();
    }

    if (collectSuccess) {
      collectWrite();
    }
  }, [mirrorSuccess, collectSuccess]);

  console.log("tying this out")

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
  };
};

export default useReactions;
