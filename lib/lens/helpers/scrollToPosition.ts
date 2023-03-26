import { Profile } from "../../../components/Common/types/lens.types";
import {
  explorePublications,
  explorePublicationsAuth,
} from "../../../graphql/queries/explorePublications";
import feedTimeline from "../../../graphql/queries/feedTimeline";
import {
  profilePublications,
  profilePublicationsAuth,
} from "../../../graphql/queries/profilePublication";
import { getScrollPosition, removeScrollPosition } from "../utils";

export const scrollToPosition = async (
  firstPubLoad: boolean,
  hasMore: boolean,
  setHasMore: (e: boolean) => void,
  feedArr: any,
  type: number,
  auth: boolean | undefined,
  feedOrder?: string[],
  feedType?: {
    tags: {
      oneOf: string[];
    };
    mainContentFocus?: string[] | undefined;
  },
  userView?: Profile | undefined,
  lensProfile?: string
): Promise<any> => {
  try {
    let feed: any[] = feedArr?.items;
    let paginatedData = feedArr?.pageInfo;
    if (firstPubLoad) {
      const postStorage = getScrollPosition();
      if (postStorage) {
        let postElement: any | undefined;
        postElement = Array.from(feed).find(
          (post: any) => post?.id === JSON.parse(postStorage).id
        );

        if (!postElement && hasMore) {
          while (!postElement) {
            let publicationsList;
            if (type === 0) {
              if (auth) {
                publicationsList = await explorePublicationsAuth({
                  sources: "thedial",
                  publicationTypes: feedOrder,
                  limit: 20,
                  sortCriteria: "LATEST",
                  noRandomize: true,
                  cursor: paginatedData?.next,
                  metadata: feedType,
                });
              } else {
                publicationsList = await explorePublications({
                  sources: "thedial",
                  publicationTypes: feedOrder,
                  limit: 20,
                  sortCriteria: "LATEST",
                  noRandomize: true,
                  cursor: paginatedData?.next,
                  metadata: feedType,
                });
              }
              feed = [
                ...feed,
                ...publicationsList?.data?.explorePublications?.items,
              ];
              paginatedData =
                publicationsList?.data?.explorePublications.pageInfo;
              postElement = Array.from(feed).find(
                (post: any) => post?.id === JSON.parse(postStorage).id
              ) as any;

              if (
                !publicationsList ||
                publicationsList?.data.explorePublications.items.length < 20
              ) {
                setHasMore(false);
                break;
              }
            } else if (type === 1) {
              if (auth) {
                publicationsList = await profilePublicationsAuth({
                  sources: "thedial",
                  profileId: (userView as any)?.profileId,
                  publicationTypes: feedOrder,
                  limit: 20,
                  metadata: feedType,
                  cursor: paginatedData?.next,
                });
              } else {
                publicationsList = await profilePublications({
                  sources: "thedial",
                  profileId: (userView as any)?.profileId,
                  publicationTypes: feedOrder,
                  limit: 20,
                  metadata: feedType,
                  cursor: paginatedData?.next,
                });
              }
              feed = [...feed, ...publicationsList?.data?.publications?.items];
              paginatedData = publicationsList?.data?.publications.pageInfo;
              postElement = Array.from(feed).find(
                (post: any) => post?.id === JSON.parse(postStorage).id
              ) as any;

              if (
                !publicationsList ||
                publicationsList?.data.publications.items.length < 20
              ) {
                setHasMore(false);
                break;
              }
            } else {
              publicationsList = await feedTimeline({
                sources: "thedial",
                profileId: lensProfile,
                limit: 50,
                cursor: paginatedData?.next,
              });

              feed = [...feed, ...publicationsList?.data?.feed?.items];
              paginatedData = publicationsList?.data?.feed?.pageInfo;
              postElement = Array.from(feed).find(
                (post: any) => post?.id === JSON.parse(postStorage).id
              ) as any;

              if (
                !publicationsList ||
                publicationsList?.data?.feed?.items.length < 50
              ) {
                setHasMore(false);
                break;
              }
            }
          }
        }
      }
    } 
    return { feed, paginatedData };
  } catch (err: any) {
    console.error(err.message);
  }
};
