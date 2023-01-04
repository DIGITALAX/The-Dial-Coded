import { gql } from "@apollo/client";
import { apolloClient } from "../../lib/lens/client";

const FOLLOWED_BY_ME = `query Profile($request: SingleProfileQueryRequest!) {
    profile(request: $request) {
      isFollowedByMe
    }
  }`;

const followedByMe = (request: any) => {
  return apolloClient.query({
    query: gql(FOLLOWED_BY_ME),
    variables: {
      request: request,
    },
  });
};

export default followedByMe;
