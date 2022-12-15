import { useEffect, useState } from "react";
import explorePublications from "../../../../../../../graphql/queries/explorePublications";
import {
  PaginatedResultInfo,
  Post,
} from "../../../../../../Common/types/lens.types";
import { UseMainResults } from "../types/feed.types";

const useMain = (): UseMainResults => {
  const [feedType, setFeedType] = useState<string[]>(["POST"]);
  const [sortCriteria, setSortCriteria] = useState<string>("LATEST");
  const [publicationsFeed, setPublicationsFeed] = useState<Post[]>([]);
  const [paginatedResults, setPaginatedResults] =
    useState<PaginatedResultInfo>();
  const [hasMoreBoolean, setHasMoreBoolean] = useState<boolean>(false);
  const fetchPublications = async (): Promise<void> => {
    try {
      const publicationsList = await explorePublications({
        sources: "thedial",
        publicationTypes: feedType,
        limit: 20,
        sortCriteria: sortCriteria,
        noRandomize: true,
      });
      const arr: any[] = [...publicationsList?.data.explorePublications.items];
      const sortedArr: any[] = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      setPublicationsFeed(sortedArr);
      setPaginatedResults(publicationsList?.data.explorePublications.pageInfo);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const fetchMorePublications = async (): Promise<void> => {
    try {
      const morePublications = await explorePublications({
        sources: "thedial",
        publicationTypes: feedType,
        limit: 20,
        sortCriteria: sortCriteria,
        noRandomize: true,
        cursor: paginatedResults?.next,
      });
      const arr: any[] = [...morePublications?.data.explorePublications.items];
      const sortedArr: any[] = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      setPublicationsFeed(sortedArr);
      setPaginatedResults(morePublications?.data.explorePublications.pageInfo);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchPublications();
  }, []);

  return {
    setFeedType,
    setSortCriteria,
    fetchMorePublications,
    publicationsFeed,
    hasMoreBoolean,
  };
};

export default useMain;
