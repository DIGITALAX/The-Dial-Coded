import { gql } from "@apollo/client";
import { apolloClient } from "./../../lib/lens/client";

export const FOLLOW_TYPE = `
mutation CreateSetFollowModuleTypedData($request: CreateSetFollowModuleRequest!) {
    createSetFollowModuleTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          SetFollowModuleWithSig {
            name
            type
          }
        }
        domain {
          name
          chainId
          version
          verifyingContract
        }
        value {
          nonce
          deadline
          profileId
          followModule
          followModuleInitData
        }
      }
    }
  }
`;

const createSetFollowTypedData = (CreateFollowTypeRequest: any) => {
  return apolloClient.mutate({
    mutation: gql(FOLLOW_TYPE),
    variables: {
      request: CreateFollowTypeRequest,
    },
  });
};

export default createSetFollowTypedData;

