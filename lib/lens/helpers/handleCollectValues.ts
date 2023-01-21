import { AnyAction, Dispatch } from "redux";
import lodash from "lodash";
import { CollectValueType } from "../../../components/Common/types/common.types";
import { Erc20 } from "../../../components/Common/types/lens.types";
import { setCollectValueType } from "../../../redux/reducers/collectValueTypeSlice";

const handleSetCollectValues = (
  value: number,
  chargeCollect: string,
  dispatch: Dispatch<AnyAction>,
  limit: number,
  enabledCurrency: string | undefined,
  enabledCurrencies: Erc20[],
  collectible: string,
  audienceType: string,
  timeLimit: string,
  limitedEdition: string,
  referral: number,
  address: string
): void => {
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
              currency: setCurrency[0]?.address,
              value: String(value),
            },
            recipient: address as string,
            referralFee: Number(Number(referral).toFixed(2)),
            followerOnly: audienceType === "everyone" ? false : true,
          },
        };
      } else if (timeLimit === "yes" && limitedEdition === "no") {
        collectModuleType = {
          timedFeeCollectModule: {
            amount: {
              currency: setCurrency[0]?.address,
              value: String(value),
            },
            recipient: address as string,
            referralFee: Number(Number(referral).toFixed(2)),
            followerOnly: audienceType === "everyone" ? false : true,
          },
        };
      } else if (timeLimit === "no" && limitedEdition === "yes") {
        collectModuleType = {
          limitedFeeCollectModule: {
            collectLimit: String(limit),
            amount: {
              currency: setCurrency[0]?.address,
              value: String(value),
            },
            recipient: address as string,
            referralFee: Number(Number(referral).toFixed(2)),
            followerOnly: audienceType === "everyone" ? false : true,
          },
        };
      } else if (timeLimit === "yes" && limitedEdition === "yes") {
        collectModuleType = {
          limitedTimedFeeCollectModule: {
            collectLimit: String(limit),
            amount: {
              currency: setCurrency[0]?.address,
              value: String(value),
            },
            recipient: address as string,
            referralFee: Number(Number(referral).toFixed(2)),
            followerOnly: audienceType === "everyone" ? false : true,
          },
        };
      }
    }
  }
  dispatch(setCollectValueType(collectModuleType));
};

export default handleSetCollectValues;
