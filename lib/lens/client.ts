import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from "@apollo/client";
import { BASE_URL } from "./constants";
import { getAuthenticationToken, isAuthExpired, refreshAuth } from "./utils";
import jwt_decode from "jwt-decode";
import { RetryLink } from "@apollo/client/link/retry";

const httpLink = new HttpLink({ uri: BASE_URL });

const retryLink = new RetryLink();

let link: any;

link = ApolloLink.from([retryLink, httpLink]);

type decodedType = {
  exp: number;
  iat: number;
  id: string;
  role: string;
};
let decoded: decodedType;

// auth client
export const authClient = new ApolloClient({
  link: link,
  uri: BASE_URL,
  cache: new InMemoryCache(),
});

// main client
const authLink = new ApolloLink((operation, forward) => {
  const { accessToken, exp } = getAuthenticationToken() as {
    accessToken: string;
    refreshToken: string;
    exp: number;
  };
  if (!accessToken) {
    return null;
  }

  let authToken: string = accessToken;

  if (isAuthExpired(exp)) {
    const refreshedAccessToken = refreshAuth();
    if (!refreshedAccessToken) {
      return null;
    }
    authToken = refreshedAccessToken as any;
  }

  operation.setContext({
    headers: {
      "x-access-token": authToken ? `Bearer ${authToken}` : "",
    },
  });

  return forward(operation);
});

link = ApolloLink.from([retryLink, authLink.concat(httpLink)]);

export const apolloClient = new ApolloClient({
  link: link,
  uri: BASE_URL,
  cache: new InMemoryCache(),
});
