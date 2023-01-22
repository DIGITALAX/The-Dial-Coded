import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  usePrepareSendTransaction,
  useSendTransaction,
  useSignTypedData,
} from "wagmi";
import collect from "../../../../graphql/mutations/collect";
import {
  getPublication,
  getPublicationAuth,
} from "../../../../graphql/queries/getPublication";
import whoCollectedPublications from "../../../../graphql/queries/whoCollectPublications";
import { LENS_HUB_PROXY_ADDRESS_MUMBAI } from "../../../../lib/lens/constants";
import { setInsufficientFunds } from "../../../../redux/reducers/insufficientFunds";
import { setPostCollectValues } from "../../../../redux/reducers/postCollectValuesSlice";
import { setReactionState } from "../../../../redux/reducers/reactionStateSlice";
import { RootState } from "../../../../redux/store";
import {
  ApprovedAllowanceAmount,
  PaginatedResultInfo,
  WhoCollectedPublicationRequest,
} from "../../types/lens.types";
import LensHubProxy from "./../../../../abis/LensHubProxy.json";
import checkIndexed from "../../../../graphql/queries/checkIndexed";
import { setIndexModal } from "../../../../redux/reducers/indexModalSlice";
import omit from "../../../../lib/lens/helpers/omit";
import splitSignature from "../../../../lib/lens/helpers/splitSignature";
import handleIndexCheck from "../../../../lib/lens/helpers/handleIndexCheck";
import handleCoinUSDConversion from "../../../../lib/lens/helpers/handleCoinUSDConversion";
import checkApproved from "../../../../lib/lens/helpers/checkApproved";

const useCollected = () => {
  const {
    query: { id },
  } = useRouter();
  const pubId = useSelector(
    (state: RootState) => state.app.reactionStateReducer.value
  );
  const reactions = useSelector(
    (state: RootState) => state.app.reactionStateReducer
  );
  const profileId: any = useSelector(
    (state: RootState) => state?.app?.lensProfileReducer?.profile?.id
  );
  const isConnected = useSelector(
    (state: RootState) => state.app.walletConnectedReducer.value
  );
  const [collectArgs, setCollectArgs] = useState<any>();
  const [collectors, setCollectors] = useState<
    WhoCollectedPublicationRequest[]
  >([]);
  const [collectLoading, setCollectLoading] = useState<boolean>(false);
  const { address } = useAccount();
  const { signTypedDataAsync } = useSignTypedData();
  const dispatch = useDispatch();
  const [collectPageInfo, setCollectPageInfo] = useState<PaginatedResultInfo>();
  const [collectInfoLoading, setCollectInfoLoading] = useState<boolean>(false);
  const [postCollectInfoLoading, setPostCollectInfoLoading] =
    useState<boolean>(false);
  const [approvalLoading, setApprovalLoading] = useState<boolean>(false);
  const approvalArgs = useSelector(
    (state: RootState) => state.app.approvalArgsReducer.args
  );

  // read collects
  const getPostCollects = async (): Promise<void> => {
    setPostCollectInfoLoading(true);
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
    setPostCollectInfoLoading(false);
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

  const getCollectInfo = async (): Promise<void> => {
    setCollectInfoLoading(true);
    try {
      let pubData: any;
      if (profileId) {
        const { data } = await getPublicationAuth({
          publicationId: reactions.value,
        });
        pubData = data;
      } else {
        const { data } = await getPublication({
          publicationId: reactions.value,
        });
        pubData = data;
      }
      const collectModule = pubData?.publication?.collectModule;
      const convertedValue = await handleCoinUSDConversion(
        collectModule?.amount?.asset?.symbol,
        collectModule?.amount?.value
      );
      const approvalData: ApprovedAllowanceAmount | void = await checkApproved(
        collectModule?.amount?.asset?.address,
        collectModule?.type,
        null,
        null,
        collectModule?.amount?.value,
        dispatch,
        isConnected,
        profileId
      );
      const isApproved = parseInt(approvalData?.allowance as string, 16);
      dispatch(
        setPostCollectValues({
          actionType: collectModule?.type,
          actionLimit: collectModule?.collectLimit,
          actionRecipient: collectModule?.recipient,
          actionReferralFee: collectModule?.referralFee,
          actionEndTime: collectModule?.endTimestamp,
          actionValue: collectModule?.value,
          actionFollowerOnly: collectModule?.followerOnly,
          actionAmount: {
            asset: {
              address: collectModule?.amount?.asset?.address,
              decimals: collectModule?.amount?.asset?.decimals,
              name: collectModule?.amount?.asset?.name,
              symbol: collectModule?.amount?.asset?.symbol,
            },
            value: collectModule?.amount?.value,
          },
          actionUSD: convertedValue ? convertedValue : null,
          actionCanCollect: pubData?.publication?.hasCollectedByMe,
          actionApproved:
            collectModule?.type === "FreeCollectModule" ||
            isApproved > collectModule?.amount?.value
              ? true
              : false,
          actionTotalCollects:
            pubData?.publication?.stats?.totalAmountOfCollects,
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setCollectInfoLoading(false);
  };

  // write collects
  const { config: approvalConfig } = usePrepareSendTransaction({
    request: {
      to: approvalArgs?.to as string,
      from: approvalArgs?.from as string,
      data: approvalArgs?.data as string,
    },
    // enabled: Boolean(approvalSendEnabled),
  });

  const { sendTransactionAsync, isSuccess: approvalSuccess } =
    useSendTransaction(approvalConfig);

  const callApprovalSign = async (): Promise<void> => {
    try {
      const tx = await sendTransactionAsync?.();
      await tx?.wait();
      const indexedStatus = await checkIndexed(tx?.hash);
      if (
        indexedStatus?.data?.hasTxHashBeenIndexed?.metadataStatus?.status ===
        "SUCCESS"
      ) {
        // re-get collect info
        getCollectInfo();
      }
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

  const { config, isSuccess } = usePrepareContractWrite({
    address: LENS_HUB_PROXY_ADDRESS_MUMBAI,
    abi: LensHubProxy,
    functionName: "collectWithSig",
    enabled: Boolean(collectArgs),
    args: [collectArgs],
  });

  const { writeAsync, isSuccess: txComplete } = useContractWrite(config);

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
      if (err.message.includes("You do not have enough")) {
        dispatch(setInsufficientFunds("insufficient"));
      }
    }
    setCollectLoading(false);
  };

  const collectWrite = async (): Promise<void> => {
    setCollectLoading(true);
    try {
      const tx = await writeAsync?.();
      setCollectLoading(false);
      dispatch(
        setReactionState({
          actionOpen: false,
          actionType: "collect",
          actionValue: pubId,
        })
      );
      dispatch(
        setIndexModal({
          actionValue: true,
          actionMessage: "Indexing Interaction",
        })
      );
      const res = await tx?.wait();
      await handleIndexCheck(res?.transactionHash, dispatch, false);
    } catch (err: any) {
      console.error(err.message);
      setCollectLoading(false);
      dispatch(setInsufficientFunds("failed"));
    }
  };

  useEffect(() => {
    if (reactions.type === "collect") {
      getPostCollects();
      getCollectInfo();
    }
  }, [reactions.type, reactions.open, id, pubId]);

  useEffect(() => {
    if (isSuccess) {
      collectWrite();
    }
  }, [isSuccess]);

  return {
    collectLoading,
    collectInfoLoading,
    postCollectInfoLoading,
    getMorePostCollects,
    approvalLoading,
    collectPost,
    approveCurrency,
    collectors,
  };
};

export default useCollected;
