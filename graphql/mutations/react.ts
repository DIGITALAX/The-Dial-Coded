import { gql } from "@apollo/client";
import { apolloClient } from "../../lib/lens/client";

export const ADD_REACTION = `mutation AddReaction($request: ReactionRequest!) {
    addReaction(request: $request)
  }`;

export const REMOVE_REACTION = `mutation AddReaction($request: ReactionRequest!) {
  addReaction(request: $request)
}`;

export const addReaction = (request: any) => {
  return apolloClient.mutate({
    mutation: gql(ADD_REACTION),
    variables: {
      request: request,
    },
  });
};

export const removeReaction = (request: any) => {
  return apolloClient.mutate({
    mutation: gql(REMOVE_REACTION),
    variables: {
      request: request,
    },
  });
};
