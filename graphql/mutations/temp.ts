import { gql } from "@apollo/client";
import { apolloClient } from "../../lib/lens/client";

export const ADD_REACTION = `mutation CreateProfile {
    createProfile(request:{ 
                  handle: "bravelensprofhere2233",
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

export const REMOVE_REACTION = `mutation CreateSetDefaultProfileTypedData {
    createSetDefaultProfileTypedData(request: { profileId: "0x6356"}) {
      id
      expiresAt
      typedData {
        types {
          SetDefaultProfileWithSig {
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
          wallet
          profileId
        }
      }
    }
  }`;

export const single = `query Profile {
    profile(request: { handle: "chromelensprofhere.test" }) {
      id
      name
      bio
      attributes {
        displayType
        traitType
        key
        value
      }
      followNftAddress
      metadata
      isDefault
      picture {
        ... on NftImage {
          contractAddress
          tokenId
          uri
          verified
        }
        ... on MediaSet {
          original {
            url
            mimeType
          }
        }
        __typename
      }
      handle
      coverPicture {
        ... on NftImage {
          contractAddress
          tokenId
          uri
          verified
        }
        ... on MediaSet {
          original {
            url
            mimeType
          }
        }
        __typename
      }
      ownedBy
      dispatcher {
        address
        canUseRelay
      }
      stats {
        totalFollowers
        totalFollowing
        totalPosts
        totalComments
        totalMirrors
        totalPublications
        totalCollects
      }
      followModule {
        ... on FeeFollowModuleSettings {
          type
          amount {
            asset {
              symbol
              name
              decimals
              address
            }
            value
          }
          recipient
        }
        ... on ProfileFollowModuleSettings {
          type
        }
        ... on RevertFollowModuleSettings {
          type
        }
      }
    }
  }`;

export const createProfile = () => {
  return apolloClient.mutate({
    mutation: gql(ADD_REACTION),
    fetchPolicy: "no-cache",
  });
};

export const defaultProfile = () => {
  return apolloClient.mutate({
    mutation: gql(REMOVE_REACTION),
    fetchPolicy: "no-cache",
  });
};

export const singleProfile = () => {
  return apolloClient.query({
    query: gql(single),
    fetchPolicy: "no-cache",
  });
};
