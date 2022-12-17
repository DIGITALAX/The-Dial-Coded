import { gql } from "@apollo/client";
import { apolloClient } from "./../../lib/lens/client";

export const COMMENT_POST = `mutation CreateCommentTypedData($request: CreateCommentRequest!) {
    createCommentTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          CommentWithSig {
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
          contentURI
          referenceModuleData
          collectModule
          collectModuleInitData
          referenceModule
          referenceModuleInitData
        }
      }
    }
  }`;

const comment = (CreateMirrorTypedData: any) => {
  return apolloClient.mutate({
    mutation: gql(COMMENT_POST),
    variables: {
      request: CreateMirrorTypedData,
    },
  });
};

export default comment;
