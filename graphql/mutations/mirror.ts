import { gql } from "@apollo/client";
import { apolloClient } from "./../../lib/lens/client";

export const MIRROR_POST = `mutation CreateMirrorTypedData($request: CreateMirrorRequest!) {
    createMirrorTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          MirrorWithSig {
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
          profileIdPointed
          pubIdPointed
          referenceModule
          referenceModuleData
          referenceModuleInitData
        }
      }
    }
  }`;

const mirror = (CreateMirrorTypedData: any) => {
  return apolloClient.mutate({
    mutation: gql(MIRROR_POST),
    variables: {
      request: CreateMirrorTypedData,
    },
  });
};

export default mirror;
