import { PublicationSearchResult } from "../../../components/Common/types/lens.types";

export const scrollToPosition = async (
  feedItems: PublicationSearchResult[],
  postStorage: string,
  fetchMorePublications: () => Promise<any[] | void>
): Promise<void> => {
  let postElement: PublicationSearchResult | undefined;
  postElement = Array.from(feedItems).find(
    (post: any) => post.id === postStorage
  );
  try {
    while (!postElement) {
      const items = await fetchMorePublications();
      if (items && items.length > 0) {
        postElement = Array.from(feedItems).find(
          (post: any) => post.id === postStorage
        );
      }
    }
    // const element = document.getElementById((postElement).id);
    console.log({ postElement });
    const postElementBounds = (postElement as any).getBoundingClientRect();
    const scrollableDivBounds = document
      .getElementsByClassName(
        "relative w-full h-fit grid grid-flow-row auto-rows-auto gap-3 overflow-y-scroll"
      )[0]
      .getBoundingClientRect();
    const scrollPosition = postElementBounds.top - scrollableDivBounds.top;
    document
      .getElementsByClassName(
        "relative w-full h-fit grid grid-flow-row auto-rows-auto gap-3 overflow-y-scroll"
      )[0]
      .scrollBy({
        top: scrollPosition,
        behavior: "smooth",
      });
  } catch (err: any) {
    console.error(err.message);
  }
};
