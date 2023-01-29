import { gql } from "@apollo/client";
import { authClient } from "../../lib/lens/client";

const APPROVED_ALLOWANCE = `
query ApprovedModuleAllowanceAmount(request: ApprovedModuleAllowanceAmountRequest!) {
  approvedModuleAllowanceAmount(request: $request) {
    currency
    module
    contractAddress
    allowance
  }
}
`;

const getModuleAllowance = (request: any) => {
  return authClient.query({
    query: gql(APPROVED_ALLOWANCE),
    variables: {
      request: request,
    },
    fetchPolicy: "no-cache",
  });
};

export default getModuleAllowance;
