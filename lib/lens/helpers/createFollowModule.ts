import lodash from "lodash";
import { Erc20 } from "../../../components/Common/types/lens.types";

const createFollowModule = (
  followFee: string,
  value: number,
  setFollowLoading: (e: boolean) => void,
  enabledCurrency: string | undefined,
  address: string,
  set: boolean,
  enabledCurrencies?: Erc20[]
): any => {
  let followModule: any;
  let currency: any;
  if (followFee === "free" || !followFee) {
    if (set) {
      followModule = null;
    } else {
      followModule = {
        freeFollowModule: true,
      };
    }
  } else if (followFee === "revert") {
    followModule = {
      revertFollowModule: true,
    };
  } else {
    if ((!value || Number(Number(value).toFixed(2)) <= 0) && !set) {
      setFollowLoading(false);
      alert("Follow Fee Must be greater than 0");
      return;
    }
    if (!set) {
      currency = lodash.filter(
        enabledCurrencies,
        (currency) => currency.symbol === enabledCurrency
      )[0].address;
      followModule = {
        feeFollowModule: {
          amount: {
            currency,
            value: String(Number(value).toFixed(2)),
          },
          recipient: address,
        },
      };
    } else {
      currency = enabledCurrency;
      followModule = {
        feeFollowModule: {
          amount: {
            currency,
            value: String(Number(value).toFixed(2)),
          },
        },
      };
    }
  }

  return followModule;
};

export default createFollowModule;
