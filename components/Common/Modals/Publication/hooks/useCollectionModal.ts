import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAccount } from "wagmi";
import getEnabledCurrencies from "../../../../../graphql/queries/getEnabledCurrencies";
import { setCollectOptionsModal } from "../../../../../redux/reducers/collectOptionsModalSlice";
import { setCollectValueType } from "../../../../../redux/reducers/collectValueTypeSlice";
import { RootState } from "../../../../../redux/store";
import {
  CollectValueType,
  UseCollectionModalResults,
} from "../../../types/common.types";
import { Erc20 } from "../../../types/lens.types";
import lodash from "lodash";
import { setCollectNotification } from "../../../../../redux/reducers/collectNotificationSlice";

const useCollectionModal = (): UseCollectionModalResults => {
  const [enabledCurrencies, setEnabledCurrencies] = useState<Erc20[]>([]);
  const dispatch = useDispatch();
  const [audienceType, setAudienceType] = useState<string>("everyone");
  const [enabledCurrency, setEnabledCurrency] = useState<string>();
  const [chargeCollectDropDown, setChargeCollectDropDown] =
    useState<boolean>(false);
  const [audienceDropDown, setAudienceDropDown] = useState<boolean>(false);
  const [currencyDropDown, setCurrencyDropDown] = useState<boolean>(false);
  const [limitedDropDown, setLimitedDropDown] = useState<boolean>(false);
  const [limitedEdition, setLimitedEdition] = useState<string>("no");
  const [collectibleDropDown, setCollectibleDropDown] =
    useState<boolean>(false);
  const [timeLimit, setTimeLimit] = useState<string>("no");
  const [timeLimitDropDown, setTimeLimitDropDown] = useState<boolean>(false);
  const [chargeCollect, setChargeCollect] = useState<string>("no");
  const [collectible, setCollectible] = useState<string>("yes");
  const [limit, setLimit] = useState<number>(1);
  const [value, setValue] = useState<number>(0);
  const [referral, setReferral] = useState<number>(0);
  const availableCurrencies = async (): Promise<void> => {
    const response = await getEnabledCurrencies();
    setEnabledCurrencies(response.data.enabledModuleCurrencies);
    setEnabledCurrency(response.data.enabledModuleCurrencies[0]?.symbol);
  };
  const { address } = useAccount();
  const audienceTypes: string[] = ["only followers", "everyone"];
  const publicationModuleOpen = useSelector(
    (state: RootState) => state.app.publicationReducer.value
  );
  useMemo(() => {
    if (publicationModuleOpen) {
      availableCurrencies();
    }
  }, [publicationModuleOpen]);

  const handleSetCollectValues = (): void => {
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
    const setCurrency: Erc20[] = lodash.filter(
      enabledCurrencies,
      (currency) => currency.symbol === enabledCurrency
    );
    let collectModuleType: CollectValueType = {
      freeCollectModule: {
        followerOnly: false,
      },
    };
    if (collectible === "no") {
      collectModuleType = {
        revertCollectModule: true,
      };
    } else if (collectible === "yes") {
      if (chargeCollect === "no") {
        collectModuleType = {
          freeCollectModule: {
            followerOnly: audienceType === "everyone" ? false : true,
          },
        };
      } else {
        if (timeLimit === "no" && limitedEdition === "no") {
          collectModuleType = {
            feeCollectModule: {
              amount: {
                currency: setCurrency[0].address,
                value: String(value),
              },
              recipient: address as string,
              referralFee: Number(referral),
              followerOnly: audienceType === "everyone" ? false : true,
            },
          };
        } else if (timeLimit === "yes" && limitedEdition === "no") {
          collectModuleType = {
            timedFeeCollectModule: {
              amount: {
                currency: setCurrency[0].address,
                value: String(value),
              },
              recipient: address as string,
              referralFee: Number(referral),
              followerOnly: audienceType === "everyone" ? false : true,
            },
          };
        } else if (timeLimit === "no" && limitedEdition === "yes") {
          collectModuleType = {
            limitedFeeCollectModule: {
              collectLimit: String(limit),
              amount: {
                currency: setCurrency[0].address,
                value: String(value),
              },
              recipient: address as string,
              referralFee: Number(referral),
              followerOnly: audienceType === "everyone" ? false : true,
            },
          };
        } else if (timeLimit === "yes" && limitedEdition === "yes") {
          collectModuleType = {
            limitedTimedFeeCollectModule: {
              collectLimit: String(limit),
              amount: {
                currency: setCurrency[0].address,
                value: String(value),
              },
              recipient: address as string,
              referralFee: Number(referral),
              followerOnly: audienceType === "everyone" ? false : true,
            },
          };
        }
      }
    }
    dispatch(setCollectValueType(collectModuleType));
    dispatch(setCollectOptionsModal(false));
  };

  return {
    enabledCurrencies,
    audienceTypes,
    setAudienceType,
    audienceType,
    setEnabledCurrency,
    enabledCurrency,
    setChargeCollectDropDown,
    setAudienceDropDown,
    setCurrencyDropDown,
    chargeCollectDropDown,
    audienceDropDown,
    currencyDropDown,
    referral,
    setReferral,
    limit,
    setLimit,
    value,
    setValue,
    collectibleDropDown,
    setCollectibleDropDown,
    collectible,
    setCollectible,
    chargeCollect,
    setChargeCollect,
    limitedEdition,
    setLimitedEdition,
    limitedDropDown,
    setLimitedDropDown,
    setTimeLimit,
    timeLimit,
    timeLimitDropDown,
    setTimeLimitDropDown,
    handleSetCollectValues,
  };
};

export default useCollectionModal;
