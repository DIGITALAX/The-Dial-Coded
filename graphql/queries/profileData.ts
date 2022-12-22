import { gql } from "@apollo/client";
import { apolloClient } from "../../lib/lens/client";

const PROFILE_DATA = `
query Profile($request: SingleProfileQueryRequest!, $who: ProfileId) {
  profile(request: $request) {
    followNftAddress
    isFollowedByMe
    isFollowing(who: $who)
  }
}
`;

const followingData = (handle: string, id: string) => {
  return apolloClient.query({
    query: gql(PROFILE_DATA),
    variables: { request: { handle }, who: id },
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });
};

export default followingData;
