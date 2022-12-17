import { splitSignature } from "ethers/lib/utils.js";
import { omit } from "lodash";
import { useEffect, useState } from "react";
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
  PublicationQueryRequest,
  ReactionRequest,
  WhoCollectedPublicationRequest,
} from "../../types/lens.types";
import LensHubProxy from "./../../../../abis/LensHubProxy.json";
import {
  addReaction,
  removeReaction,
} from "../../../../graphql/mutations/react";
import { setReactionState } from "../../../../redux/reducers/reactionStateSlice";
import lodash from "lodash";

const useReactions = (): UseReactionsResult => {
  const pubId = useSelector(
    (state: RootState) => state.app.reactionStateReducer.value
  );
  const { type, amount } = useSelector(
    (state: RootState) => state.app.postCollectValuesReducer
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
  const [mirrorEnabled, setmirrorEnabled] = useState<boolean>(false);
  const [args, setArgs] = useState<any>();
  const [collectors, setCollectors] = useState<
    WhoCollectedPublicationRequest[]
  >([]);
  const dispatch = useDispatch();
  const [mirrorLoading, setMirrorLoading] = useState<boolean>(false);
  const [collectPageInfo, setCollectPageInfo] = useState<PaginatedResultInfo>();
  const [mirrorPageInfo, setMirrorPageInfo] = useState<PaginatedResultInfo>();
  const [mirrorers, setMirrorers] = useState<ProfileQueryRequest[]>([]);
  const [commentors, setCommentors] = useState<PublicationQueryRequest[]>([]);
  const [commentPageInfo, setCommentPageInfo] = useState<PaginatedResultInfo>();
  const [reactionLoading, setReactionLoading] = useState<boolean>(false);
  const [reacters, setReacters] = useState<any>([]);
  const [reactionVote, setReactionVote] = useState<string | undefined>();
  const [usdValue, setUsdValue] = useState<number>();
  const [reactionPageInfo, setReactionPageInfo] =
    useState<PaginatedResultInfo>();
  const defaultProfile = useSelector(
    (state: RootState) => state?.app?.lensProfileReducer?.profile?.id
  );
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
      const reactions = await whoMirroredPublications({
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
      enabled: Boolean(mirrorEnabled),
      args: [args],
    });

  const { writeAsync: mirrorWriteAsync, isSuccess: mirrorComplete } =
    useContractMirrorWrite(mirrorConfig);

  const mirrorPost = async (): Promise<void> => {
    setMirrorLoading(true);
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
      setArgs(mirrorArgs);
      setmirrorEnabled(true);
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
        const addReactionPost = await addReaction({
          profileId: defaultProfile,
          reaction: "UPVOTE",
          publicationId: pubId,
        });
      } else {
        const removeReactionPost = await removeReaction({
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
    try {
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const approveCurrency = async (): Promise<void> => {};

  const commentPost = async (): Promise<void> => {
    try {
    } catch (err: any) {
      console.error(err.message);
    }
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

  const handleCoinUSDConversion = async () => {
    const currency = amount?.asset?.symbol.toLowerCase();
    try {
      const response = await fetch("/api/coin", {
        method: "POST",
        body: currency,
      });
      const json = await response.json();
      const usdValue = lodash.find(json.data, "usd");
      setUsdValue(usdValue.usd);
    } catch (err: any) {
      console.error(err.message);
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
      handleCoinUSDConversion();
      getPostCollects();
    }
  }, [reactions.type, reactions.open, pubId, commentShow]);

  useEffect(() => {
    if (mirrorSuccess) {
      mirrorWrite();
    }
  }, [mirrorSuccess]);

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
    usdValue
  };
};

export default useReactions;
