import { gql } from "@apollo/client";
import { apolloClient } from "./../../lib/lens/client";

export const FOLLOW_DATA = `
mutation CreateUnfollowTypedData($request: UnfollowRequest!) {
    createUnfollowTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          BurnWithSig {
            name
            type
          }
        }
        domain {
          version
          chainId
          name
          verifyingContract
        }
        value {
          nonce
          deadline
          tokenId
        }
      }
    }
  }
`;

const createUnFollowTypedData = (CreateUnFollowRequest: any) => {
  return apolloClient.mutate({
    mutation: gql(FOLLOW_DATA),
    variables: {
      request: CreateUnFollowRequest,
    },
  });
};

export default createUnFollowTypedData;
