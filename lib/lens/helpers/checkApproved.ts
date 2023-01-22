import { AnyAction, Dispatch } from "redux";
import { ApprovedAllowanceAmount } from "../../../components/Common/types/lens.types";
import approvedData from "../../../graphql/queries/approveData";
import approvedModuleAllowance from "../../../graphql/queries/approvedModuleAllowance";
import { setApprovalArgs } from "../../../redux/reducers/approvalArgsSlice";

const checkApproved = async (
  currencyAddress: string,
  collectModule: string | null,
  followModule: string | null,
  referenceModule: string | null,
  value: string,
  dispatch: Dispatch<AnyAction>,
  isConnected: boolean | undefined,
  profileId: string
): Promise<ApprovedAllowanceAmount | void> => {
  if (!currencyAddress || !isConnected || !profileId) {
    return;
  }
  try {
    const response = await approvedModuleAllowance({
      currencies: [currencyAddress],
      collectModules: collectModule ? [collectModule] : [],
      followModules: followModule ? [followModule] : [],
      referenceModules: referenceModule ? [referenceModule] : [],
    });
    let approvalArgs: any;
    if (collectModule) {
      approvalArgs = await approvedData({
        currency: currencyAddress,
        value: value,
        collectModule: collectModule,
      });
    } else if (followModule) {
      approvalArgs = await approvedData({
        currency: currencyAddress,
        value: value,
        followModule: followModule,
      });
    }
    dispatch(
      setApprovalArgs(approvalArgs?.data?.generateModuleCurrencyApprovalData)
    );
    return response?.data?.approvedModuleAllowanceAmount[0];
  } catch (err: any) {
    console.error(err.message);
  }
};

export default checkApproved;
