import { gql } from "@apollo/client";
import { apolloClient } from "./../../lib/lens/client";

export const PROFILE_METADATA = `
mutation CreateSetProfileMetadataTypedData($request: CreatePublicSetProfileMetadataURIRequest!) {
    createSetProfileMetadataTypedData(request: $request) {
      id
        expiresAt
        typedData {
          types {
            SetProfileMetadataURIWithSig {
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
            metadata
          }
        }
    }
  }
`;

const profileMetadata = (request: any) => {
  return apolloClient.mutate({
    mutation: gql(PROFILE_METADATA),
    variables: {
      request: request,
    },
  });
};

export default profileMetadata;
