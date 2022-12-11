import { UseAccountResult } from "../types/account.types";

const useAccount = (): UseAccountResult => {
  const accountTitles: string[] = ["account", "profile"];

  return { accountTitles };
};

export default useAccount;
