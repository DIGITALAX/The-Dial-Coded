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

const profileImageUpload = (request: any) => {
  return apolloClient.mutate({
    mutation: gql(PROFILE_IMAGE),
    variables: {
      request: request,
    },
  });
};

export default profileImageUpload;
