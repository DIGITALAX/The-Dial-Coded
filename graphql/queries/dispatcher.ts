import { apolloClient } from "./../../lib/lens/client";
import { gql } from "@apollo/client";

const DISPATCHER = `
  query Profile($request: SingleProfileQueryRequest!) {
    profile(request: $request) {
      dispatcher { 
        address
        canUseRelay
      }
    }
  }
  `;

const checkDispatcherEnabled = (request: any) => {
  return apolloClient.query({
    query: gql(DISPATCHER),
    variables: {
      request: request,
    },
    fetchPolicy: "no-cache",
  });
};
export default checkDispatcherEnabled;
