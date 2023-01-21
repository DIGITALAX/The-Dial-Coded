import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAccount } from "wagmi";
import { setCollectOptionsModal } from "../../../../../redux/reducers/collectOptionsModalSlice";
import { RootState } from "../../../../../redux/store";
import { UseCollectionModalResults } from "../../../types/common.types";
import { Erc20 } from "../../../types/lens.types";
import handleSetCollectValues from "../../../../../lib/lens/helpers/handleCollectValues";
import availableCurrencies from "../../../../../lib/lens/helpers/availableCurrencies";
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
  const { address } = useAccount();
  const audienceTypes: string[] = ["only followers", "everyone"];
  const publicationModuleOpen = useSelector(
    (state: RootState) => state.app.publicationReducer.open
  );
  const reactionState = useSelector(
    (state: RootState) => state.app.collectOptionsReducer.value
  );
  useMemo(() => {
    if (publicationModuleOpen || reactionState) {
      availableCurrencies(setEnabledCurrencies, setEnabledCurrency);
    }
  }, [publicationModuleOpen, reactionState]);

  const handleCollectValues = (): void => {
    if (value <= 0 && chargeCollect === "yes") {
      dispatch(setCollectNotification({ actionOpen: true, actionType: "value" }));
      return;
    }
    if (limit < 1 && chargeCollect === "yes") {
      dispatch(setCollectNotification({ actionOpen: true, actionType: "limit" }));
      return;
    }
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
    handleCollectValues,
  };
};

export default useCollectionModal;
