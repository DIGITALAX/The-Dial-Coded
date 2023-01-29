import { apolloClient } from "./../../lib/lens/client";
import { gql } from "@apollo/client";

const INDEXED = `
query HasTxHashBeenIndexed($request: HasTxHashBeenIndexedRequest!) {
    hasTxHashBeenIndexed(request: $request) {
      ... on TransactionIndexedResult {
        indexed
        txReceipt {
          to
          from
          contractAddress
          transactionIndex
          root
          gasUsed
          logsBloom
          blockHash
          transactionHash
          blockNumber
          confirmations
          cumulativeGasUsed
          effectiveGasPrice
          byzantium
          type
          status
          logs {
            blockNumber
            blockHash
            transactionIndex
            removed
            address
            data
            topics
            transactionHash
            logIndex
          }
        }
        metadataStatus {
          status
          reason
        }
      }
      ... on TransactionError {
        reason
        txReceipt {
          to
          from
          contractAddress
          transactionIndex
          root
          gasUsed
          logsBloom
          blockHash
          transactionHash
          blockNumber
          confirmations
          cumulativeGasUsed
          effectiveGasPrice
          byzantium
          type
          status
          logs {
            blockNumber
            blockHash
            transactionIndex
            removed
            address
            data
            topics
            transactionHash
            logIndex
          }
        }
      },
      __typename
    }
  }
`;

export const checkIndexed = (txHash?: string) => {
  return apolloClient.query({
    query: gql(INDEXED),
    variables: {
      request: {
        txHash,
      },
    },
    fetchPolicy: "network-only",
  });
};
export default checkIndexed;

export const pollUntilIndexed = async (txHash: string, success: boolean) => {
  while (true) {
    const response: any = await checkIndexed(txHash);
    console.log({response})
    if (
      response?.data?.hasTxHashBeenIndexed?.__typename ===
      "TransactionIndexedResult"
    ) {
      if (
        (response?.data?.hasTxHashBeenIndexed?.metadataStatus?.status ===
          "SUCCESS" &&
          success) ||
        (response?.data?.hasTxHashBeenIndexed?.indexed && !success)
      ) {
        console.log("in here")
        return true;
      } else {
        if (response?.data?.hasTxHashBeenIndexed?.indexed === false) {
          return false;
        }
      }
      await new Promise((resolve) => setTimeout(resolve, 1500));
    } else {
      return false;
    }
  }
};
