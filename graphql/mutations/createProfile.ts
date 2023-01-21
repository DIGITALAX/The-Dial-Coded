import { gql } from "@apollo/client";
import { apolloClient } from "./../../lib/lens/client";

export const DISPATCHER_POST = `mutation CreateProfile {
    createProfile(request:{ 
                  handle: "ejtest1313",
                  profilePictureUri: null,
                  followNFTURI: null,
                  followModule: null
                  }) {
      ... on RelayerResult {
        txHash
      }
      ... on RelayError {
        reason
      }
      __typename
    }
  }`;

const createProfile = () => {
  return apolloClient.mutate({
    mutation: gql(DISPATCHER_POST),
  });
};

export default createProfile;