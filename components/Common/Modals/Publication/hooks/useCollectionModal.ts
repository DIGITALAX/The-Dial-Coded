import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import getEnabledCurrencies from "../../../../../graphql/queries/getEnabledCurrencies";
import { RootState } from "../../../../../redux/store";
import { UseCollectionModalResults } from "../../../types/common.types";
import { Erc20 } from "../../../types/lens.types";

const useCollectionModal = (): UseCollectionModalResults => {
  const [enabledCurrencies, setEnabledCurrencies] = useState<Erc20[]>([]);
  const [collectType, setCollectType] = useState<string>("free");
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
  const [chargeCollect, setChargeCollect] = useState<string>("yes");
  const [collectible, setCollectible] = useState<string>("yes");
  const [limit, setLimit] = useState<number>(1);
  const [value, setValue] = useState<number>(0);
  const [referral, setReferral] = useState<number>(0);
  const collectTypes: string[] = [
    "free",
    "revert",
    "fee",
    "limited fee",
    "limited timed fee",
    "timed fee",
  ];
  const availableCurrencies = async (): Promise<void> => {
    const response = await getEnabledCurrencies();
    setEnabledCurrencies(response.data.enabledModuleCurrencies);
    setEnabledCurrency(response.data.enabledModuleCurrencies[0]?.symbol);
  };
  const audienceTypes: string[] = ["only followers", "everyone"];
  const publicationModuleOpen = useSelector(
    (state: RootState) => state.app.publicationReducer.value
  );
  useMemo(() => {
    if (publicationModuleOpen) {
      availableCurrencies();
    }
  }, [publicationModuleOpen]);
  return {
    collectTypes,
    enabledCurrencies,
    audienceTypes,
    setCollectType,
    collectType,
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
  };
};

export default useCollectionModal;
