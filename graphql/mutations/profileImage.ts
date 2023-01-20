import { gql } from "@apollo/client";
import { apolloClient } from "./../../lib/lens/client";

export const PROFILE_IMAGE = `mutation CreateSetProfileImageURITypedData($request: UpdateProfileImageRequest!) {
    createSetProfileImageURITypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          SetProfileImageURIWithSig {
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
          imageURI
          profileId
        }
      }
    }
  }`;

export const DISPATCH_PROFILE_IMAGE = `mutation CreateSetProfileImageURIViaDispatcher($request: UpdateProfileImageRequest!) {
  createSetProfileImageURIViaDispatcher(request: $request) {
    ... on RelayerResult {
      txHash
      txId
    }
    ... on RelayError {
      reason
    }
  }
}`;

export const profileImageUpload = (request: any) => {
  return apolloClient.mutate({
    mutation: gql(PROFILE_IMAGE),
    variables: {
      request: request,
    },
  });
};

export const dispatchProfileImage = (request: any) => {
  return apolloClient.mutate({
    mutation: gql(DISPATCH_PROFILE_IMAGE),
    variables: {
      request: request,
    },
  });
};
