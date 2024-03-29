import { gql } from "@apollo/client";
import { apolloClient } from "../../lib/lens/client";

const NOTIFICATIONS = `query Notifications($request: NotificationRequest!) {
    result: notifications(request: $request) {
      items {
        ... on NewFollowerNotification {
          notificationId
          ...NewFollowerNotificationFields
        }
  
        ... on NewMirrorNotification {
          notificationId
          ...NewMirrorNotificationFields
        }
  
        ... on NewCollectNotification {
          notificationId
          ...NewCollectNotificationFields
        }
  
        ... on NewCommentNotification {
          notificationId
          ...NewCommentNotificationFields
        }
        
        ... on NewMentionNotification {
          notificationId
          ...NewMentionNotificationFields
        }
        
        ... on NewReactionNotification {
          notificationId
          ...NewReactionNotificationFields
        }
      }
      pageInfo {
        ...CommonPaginatedResultInfo
      }
    }
  }
  
  fragment CommentWithCommentedPublicationFields on Comment {
    ...CompactComment
    commentOn {
      ... on Post {
        ...CompactPost
      }
      ... on Mirror {
        ...CompactMirror
      }
      ... on Comment {
        ...CompactComment
      }
    }
  }
  
  fragment NewFollowerNotificationFields on NewFollowerNotification {
    __typename
    createdAt
    isFollowedByMe
    wallet {
      ...Wallet
    }
  }
  
  fragment NewCollectNotificationFields on NewCollectNotification {
    __typename
    createdAt
    wallet {
      ...Wallet
    }
    collectedPublication {
      __typename
      ... on Post {
        ...CompactPost
      }
  
      ... on Mirror {
        ...CompactMirror
      }
  
      ... on Comment {
        ...CompactComment
      }
    }
  }
  
  fragment NewMirrorNotificationFields on NewMirrorNotification {
    __typename
    createdAt
    profile {
      ...CompactProfile
    }
    publication {
      ... on Post {
        ...CompactPost
      }
      ... on Comment {
        ...CompactComment
      }
    }
  }
  
  fragment NewCommentNotificationFields on NewCommentNotification {
    __typename
    createdAt
    profile {
      ...CompactProfile
    }
    comment {
      ...CommentWithCommentedPublicationFields
    }
  }
  
  fragment NewMentionNotificationFields on NewMentionNotification {
    __typename
    mentionPublication {
      ... on Post {
        ...CompactPost
      }
      ... on Comment {
        ...CompactComment
      }
    }
    createdAt
  }
  
  fragment NewReactionNotificationFields on NewReactionNotification {
    __typename
    createdAt
    profile {
      ...CompactProfile
    }
    reaction
    publication {
      ... on Post {
        ...CompactPost
      }
      ... on Mirror {
        ...CompactMirror
      }
      ... on Comment {
        ...CompactComment
      }
    }
  }
  
  fragment CompactPublicationStats on PublicationStats {
    totalAmountOfMirrors
    totalAmountOfCollects
    totalAmountOfComments
  }
  
  fragment CompactMetadata on MetadataOutput {
    name
    description
    content
    media {
      ...ProfileMediaFields
    }
  }
  
  fragment CompactPost on Post {
    id
    stats {
      ...CompactPublicationStats
    }
    metadata {
      ...CompactMetadata
    }
    profile {
      ...CompactProfile
    }
    collectedBy {
      ...Wallet
    }
    createdAt
  }
  
  fragment CompactMirror on Mirror {
    id
    stats {
      ...CompactPublicationStats
    }
    metadata {
      ...CompactMetadata
    }
    profile {
      ...CompactProfile
    }
    createdAt
  }
  
  fragment CompactComment on Comment {
    id
    stats {
      ...CompactPublicationStats
    }
    metadata {
      ...CompactMetadata
    }
    profile {
      ...CompactProfile
    }
    collectedBy {
      ...Wallet
    }
    createdAt
  }
  
  fragment CommonPaginatedResultInfo on PaginatedResultInfo {
    prev
    next
    totalCount
  }
  
  fragment MediaFields on Media {
    url
    width
    height
    mimeType
  }
  
  fragment ProfileMediaFields on ProfileMedia {
    ... on NftImage {
      contractAddress
      tokenId
      uri
      verified
    }
  
    ... on MediaSet {
      original {
        ...MediaFields
      }
  
      small {
        ...MediaFields
      }
  
      medium {
        ...MediaFields
      }
    }
  }
  
  fragment Wallet on Wallet {
    address
    defaultProfile {
      ...CompactProfile
    }
  }
  
  fragment CompactProfile on Profile {
    id
    name
    bio
    attributes {
      displayType
      traitType
      key
      value
    }
    metadata
    isDefault
    handle
    picture {
      ... on NftImage {
        contractAddress
        tokenId
        uri
        verified
      }
      ... on MediaSet {
        original {
          ...MediaFields
        }
        small {
          ...MediaFields
        }
        medium {
          ...MediaFields
        }
      }
    }
    coverPicture {
      ... on NftImage {
        contractAddress
        tokenId
        uri
        verified
      }
      ... on MediaSet {
        original {
          ...MediaFields
        }
        small {
         ...MediaFields
        }
        medium {
          ...MediaFields
        }
      }
    }
    ownedBy
    dispatcher {
      address
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
            name
            symbol
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
  }`;

const SHORT_NOTIF = `query Notifications($request: NotificationRequest!) {
  result: notifications(request: $request) {
    items {
      ... on NewFollowerNotification {
        notificationId
      }

      ... on NewMirrorNotification {
        notificationId
      }

      ... on NewCollectNotification {
        notificationId
      }

      ... on NewCommentNotification {
        notificationId
      }
      
      ... on NewMentionNotification {
        notificationId
      }
      ... on NewReactionNotification {
        notificationId
      }
    }
  }
}`;

export const shortNotifications = (request: any) => {
  return apolloClient.query({
    query: gql(SHORT_NOTIF),
    variables: {
      request: request,
    },
    fetchPolicy: "no-cache",
  });
};

export const notifications = (request: any) => {
  return apolloClient.query({
    query: gql(NOTIFICATIONS),
    variables: {
      request: request,
    },
    fetchPolicy: "no-cache",
  });
};
