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
import approvedData from "../../../../graphql/queries/approveData";
import approvedModuleAllowance from "../../../../graphql/queries/approvedModuleAllowance";
import getPublication from "../../../../graphql/queries/getPublication";
import whoCollectedPublications from "../../../../graphql/queries/whoCollectPublications";
import { LENS_HUB_PROXY_ADDRESS_MUMBAI } from "../../../../lib/lens/constants";
import { omit, splitSignature } from "../../../../lib/lens/helpers";
import { setApprovalArgs } from "../../../../redux/reducers/approvalArgsSlice";
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
import lodash from "lodash";

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
    setPostCollectInfoLoading(false);
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

  const checkApproved = async (
    currencyAddress: string,
    collectModule: string,
    followModule: string | null,
    referenceModule: string | null,
    value: string
  ): Promise<ApprovedAllowanceAmount | void> => {
    if (!currencyAddress || !isConnected || !profileId) {
      return;
    }
    try {
      const response = await approvedModuleAllowance({
        currencies: [currencyAddress],
        collectModules: [collectModule],
        followModules: followModule ? [followModule] : [],
        referenceModules: referenceModule ? [referenceModule] : [],
      });
      const approvalArgs = await approvedData({
        currency: currencyAddress,
        value: value,
        collectModule: collectModule,
      });
      dispatch(
        setApprovalArgs(approvalArgs?.data?.generateModuleCurrencyApprovalData)
      );
      return response?.data?.approvedModuleAllowanceAmount[0];
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleCoinUSDConversion = async (
    currency: string,
    amount: string
  ): Promise<number | void> => {
    if (!amount) {
      return;
    }
    try {
      const response = await fetch("/api/coin", {
        method: "POST",
        body: currency?.toLowerCase(),
      });
      const json = await response.json();
      const usdValue = lodash.find(json.data, "usd");
      const convertedValue = Number(amount) * usdValue.usd;
      return convertedValue;
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getCollectInfo = async (): Promise<void> => {
    setCollectInfoLoading(true);
    try {
      const { data } = await getPublication({
        publicationId: reactions.value,
      });
      const collectModule = data?.publication?.collectModule;
      const convertedValue = await handleCoinUSDConversion(
        collectModule?.amount?.asset?.symbol,
        collectModule?.amount?.value
      );
      const approvalData: ApprovedAllowanceAmount | void = await checkApproved(
        collectModule?.amount?.asset?.address,
        collectModule?.type,
        null,
        null,
        collectModule?.amount?.value
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
          actionCanCollect: data?.publication?.hasCollectedByMe,
          actionApproved:
            collectModule?.type === "FreeCollectModule" ||
            isApproved > collectModule?.amount?.value
              ? true
              : false,
          actionTotalCollects: data?.publication?.stats?.totalAmountOfCollects,
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

  const collectWrite = async (): Promise<void> => {
    setCollectLoading(true);
    try {
      const tx = await writeAsync?.();
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
