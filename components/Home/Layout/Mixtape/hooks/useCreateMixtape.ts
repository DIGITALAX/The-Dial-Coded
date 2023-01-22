import { FormEvent, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMixtapeCheck } from "../../../../../redux/reducers/mixtapeCheckSlice";
import { RootState } from "../../../../../redux/store";
import {
  PostArgsType,
  UseCreateMixtapeResults,
} from "../../../../Common/types/common.types";
import { v4 as uuidv4 } from "uuid";
import { setAddTrack } from "../../../../../redux/reducers/addTrackSlice";
import {
  createDispatcherPostData,
  createPostTypedData,
} from "../../../../../graphql/mutations/createPost";
import { setIndexModal } from "../../../../../redux/reducers/indexModalSlice";
import { setInsufficientFunds } from "../../../../../redux/reducers/insufficientFunds";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useSignTypedData,
} from "wagmi";
import { LENS_HUB_PROXY_ADDRESS_MUMBAI } from "../../../../../lib/lens/constants";
import LensHubProxy from "../../../../../abis/LensHubProxy.json";
import { setCollectValueType } from "../../../../../redux/reducers/collectValueTypeSlice";
import lodash from "lodash";
import { setCompleteTrack } from "../../../../../redux/reducers/completeTrackSlice";
import { setMixtapeSource } from "../../../../../redux/reducers/mixtapeSourceSlice";
import { setMixtapeTitle } from "../../../../../redux/reducers/mixtapeTitleSlice";
import splitSignature from "../../../../../lib/lens/helpers/splitSignature";
import omit from "../../../../../lib/lens/helpers/omit";
import handleIndexCheck from "../../../../../lib/lens/helpers/handleIndexCheck";
import handleSetCollectValues from "../../../../../lib/lens/helpers/handleCollectValues";
import { Erc20 } from "../../../../Common/types/lens.types";
import availableCurrencies from "../../../../../lib/lens/helpers/availableCurrencies";
import { setCollectNotification } from "../../../../../redux/reducers/collectNotificationSlice";

const useCreateMixtape = (): UseCreateMixtapeResults => {
  const { address } = useAccount();
  const [enabledCurrencies, setEnabledCurrencies] = useState<Erc20[]>([]);
  const [audienceType, setAudienceType] = useState<string>("everyone");
  const [enabledCurrency, setEnabledCurrency] = useState<string>();
  const [limitedEdition, setLimitedEdition] = useState<string>("no");
  const [timeLimit, setTimeLimit] = useState<string>("no");
  const [chargeCollect, setChargeCollect] = useState<string>("no");
  const [collectible, setCollectible] = useState<string>("yes");
  const [limit, setLimit] = useState<number>(1);
  const [value, setValue] = useState<number>(0);
  const [referral, setReferral] = useState<number>(0);
  const [valueClicked, setValueClicked] = useState<boolean>(false);
  const [currencyDropDown, setCurrencyDropDown] = useState<boolean>(false);
  const defaultProfile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.id
  );
  const dispatcher = useSelector(
    (state: RootState) => state.app.dispatcherReducer.value
  );
  const mixtapePage = useSelector(
    (state: RootState) => state.app.mixtapePageReducer.value
  );
  const mixtapes = useSelector(
    (state: RootState) => state.app.mixtapesReducer.value
  );
  const [mixtapeLoading, setMixtapeLoading] = useState<boolean>(false);
  const [args, setArgs] = useState<any>();
  const arrays = useSelector((state: RootState) => state.app.addTrackReducer);
  const collectModuleType = useSelector(
    (state: RootState) => state?.app?.collectValueTypeReducer?.type
  );
  const check = useSelector(
    (state: RootState) => state.app.mixtapeCheckReducer.value
  );
  const mixTapeTitle = useSelector(
    (state: RootState) => state.app.mixtapeTitleReducer.value
  );
  const mixTapeSource = useSelector(
    (state: RootState) => state.app.mixtapeSourceReducer.value
  );
  const [contentURI, setContentURI] = useState<string>();
  const dispatch = useDispatch();
  const { signTypedDataAsync } = useSignTypedData();

  const { config, isSuccess: postSuccess } = usePrepareContractWrite({
    address: LENS_HUB_PROXY_ADDRESS_MUMBAI,
    abi: LensHubProxy,
    functionName: "postWithSig",
    enabled: Boolean(args),
    args: [args],
  });

  const { writeAsync } = useContractWrite(config);

  const checkValues: string[] = [
    "lens post url",
    "24/7 channel",
    "drop url",
    "image uri",
    "video uri",
    "music uri",
  ];

  const handleClicked = (e: boolean, value: string) => {
    setValueClicked(!e);
    dispatch(setMixtapeCheck(value));
  };

  const handleTrackTitle = (e: FormEvent, index: number): void => {
    let titleArray = [...(arrays?.title as string[])];
    titleArray[index] = (e.target as HTMLFormElement).value;
    dispatch(
      setAddTrack({
        actionImageURI: arrays?.imageURI,
        actionTitle: titleArray,
      })
    );
  };

  const handleTitle = (e: FormEvent) => {
    dispatch(setMixtapeTitle((e.target as HTMLFormElement).value));
  };

  const handleSource = (e: FormEvent) => {
    dispatch(setMixtapeSource((e.target as HTMLFormElement).value));
  };

  const uploadContent = async (): Promise<string | undefined> => {
    const titleFiltered = lodash.filter(
      arrays?.title,
      (title) => title !== ("" || "TRACK NAME | SOURCE (shortened)")
    );
    const imageFiltered = lodash.filter(
      arrays?.imageURI,
      (image) => image !== ""
    );

    const data = {
      version: "2.0.0",
      metadata_id: uuidv4(),
      description: mixTapeSource + "\n\n" + check + "\n\n" + titleFiltered,
      content:
        mixTapeSource +
        "\n\n" +
        check +
        "\n\n" +
        titleFiltered +
        "\n\n" +
        imageFiltered +
        "\n\n*Dial Mixtape*",
      external_url: "https://www.thedial.xyz/",
      image: null,
      imageMimeType: "image/png",
      name: mixTapeTitle?.slice(0, 20),
      mainContentFocus: "TEXT_ONLY",
      contentWarning: null,
      attributes: [
        {
          traitType: "string",
          key: "date",
          date: Date.now(),
        },
      ],
      media: [],
      locale: "en",
      tags: ["dialMixtape"],
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

  const generateMixtape = async (): Promise<void> => {
    handleSetCollectValues(
      value,
      chargeCollect,
      dispatch,
      limit,
      enabledCurrency,
      enabledCurrencies,
      collectible,
      audienceType,
      timeLimit,
      limitedEdition,
      referral,
      address as string
    );
    let titlearr: number[] = [];
    let imgarr: number[] = [];
    let result: any;
    lodash.filter(arrays?.title, (title, index: number) => {
      if (title !== ("" || "TRACK NAME | SOURCE (shortened)")) {
        titlearr.push(index);
      }
    });
    lodash.filter(arrays?.imageURI, (image, index: number) => {
      if (image !== "") {
        imgarr.push(index);
      }
    });
    if (
      !lodash.isEqual(imgarr, titlearr) ||
      !mixTapeTitle ||
      !mixTapeSource ||
      !check
    ) {
      dispatch(setCompleteTrack(true));
      return;
    }

    if (value <= 0 && chargeCollect === "yes") {
      dispatch(
        setCollectNotification({ actionOpen: true, actionType: "value" })
      );
      return;
    }
    if (limit < 1 && chargeCollect === "yes") {
      dispatch(
        setCollectNotification({ actionOpen: true, actionType: "limit" })
      );
      return;
    }
    setMixtapeLoading(true);
    try {
      const contentURI = await uploadContent();
      if (dispatcher) {
        result = await createDispatcherPostData({
          profileId: defaultProfile,
          contentURI: "ipfs://" + contentURI,
          collectModule: collectModuleType,
          referenceModule: {
            followerOnlyReferenceModule: false,
          },
        });
        clearMixtape();
        setTimeout(async () => {
          await handleIndexCheck(
            result?.data?.createPostViaDispatcher?.txHash,
            dispatch,
            true
          );
        }, 7000);
      } else {
        result = await createPostTypedData({
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
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setMixtapeLoading(false);
    dispatch(
      setCollectValueType({
        freeCollectModule: {
          followerOnly: false,
        },
      })
    );
  };

  const clearMixtape = () => {
    dispatch(
      setIndexModal({
        actionValue: true,
        actionMessage: "Indexing Interaction",
      })
    );
    dispatch(setMixtapeSource(""));
    dispatch(setMixtapeTitle(""));
    handleReverseSetCollectValues(undefined);
    dispatch(
      setAddTrack({
        actionImageURI: Array(10).fill(""),
        actionTitle: Array(10).fill("TRACK NAME | SOURCE (shortened)"),
      })
    );
  };

  const handleMixtapeWrite = async (): Promise<void> => {
    setMixtapeLoading(true);
    try {
      const tx = await writeAsync?.();
      clearMixtape();
      const res = await tx?.wait();
      await handleIndexCheck(res?.transactionHash, dispatch, true);
    } catch (err) {
      console.error(err);
      setMixtapeLoading(false);
      dispatch(setInsufficientFunds("failed"));
    }
  };

  const handleRemoveTrack = (index: number): void => {
    let imageArray = [...(arrays?.imageURI as string[])];
    let titleArray = [...(arrays?.title as string[])];
    imageArray.splice(index, 1);
    titleArray.splice(index, 1);
    dispatch(
      setAddTrack({
        actionImageURI: imageArray,
        actionTitle: titleArray,
      })
    );
  };

  const handleReverseSetCollectValues = (module: any): void => {
    if (!module) {
      setCollectible("yes");
      setAudienceType("everyone");
      setLimitedEdition("no");
      setTimeLimit("no");
      setChargeCollect("no");
      setReferral(0);
      setLimit(1);
      setValue(0);
      setEnabledCurrency(undefined);
      return;
    }

    if (module?.type === "RevertCollectModule") {
      setCollectible("no");
      return;
    } else {
      if (module?.followerOnly) {
        setAudienceType("only followers");
      } else {
        setAudienceType("everyone");
      }
      setCollectible("yes");
      setChargeCollect("no");
      if (module?.type !== "FreeCollectModule") {
        setChargeCollect("yes");
        const setCurrency: Erc20[] = lodash.filter(
          enabledCurrencies,
          (currency) => currency.address === module?.amount?.asset?.address
        );
        setEnabledCurrency(setCurrency[0]?.symbol);
        setValue(module?.amount?.value);
        setReferral(module?.referralFee);

        if (module?.type === "LimitedFeeCollectModule") {
          setLimitedEdition("yes");
          setLimit(module?.collectLimit);
        } else if (module?.type === "LimitedTimedFeeCollectModule") {
          setTimeLimit("yes");
          setLimitedEdition("yes");
          setLimit(module?.collectLimit);
        } else if (module?.type === "TimedFeeCollectModule") {
          setTimeLimit("yes");
        }
      }
    }
  };

  useEffect(() => {
    if (postSuccess) {
      handleMixtapeWrite();
    }
  }, [postSuccess]);

  useMemo(() => {
    if (mixtapePage) {
      availableCurrencies(setEnabledCurrencies, setEnabledCurrency);
      if (mixtapePage !== "Add New Mixtape") {
        const mixtape = lodash.find(
          mixtapes,
          (mix) => mix?.metadata?.name === mixtapePage
        );
        handleReverseSetCollectValues(mixtape?.collectModule);
      }
    }
  }, [mixtapePage]);

  return {
    checkValues,
    handleClicked,
    valueClicked,
    mixtapeLoading,
    handleTrackTitle,
    handleTitle,
    handleSource,
    handleRemoveTrack,
    generateMixtape,
    enabledCurrencies,
    setAudienceType,
    audienceType,
    setEnabledCurrency,
    enabledCurrency,
    setCurrencyDropDown,
    currencyDropDown,
    referral,
    setReferral,
    limit,
    setLimit,
    value,
    setValue,
    collectible,
    setCollectible,
    chargeCollect,
    setChargeCollect,
    limitedEdition,
    setLimitedEdition,
    setTimeLimit,
    timeLimit,
    handleReverseSetCollectValues,
  };
};

export default useCreateMixtape;
