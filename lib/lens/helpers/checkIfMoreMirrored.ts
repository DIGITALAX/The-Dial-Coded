import { profilePublications } from "../../../graphql/queries/profilePublication";

const checkIfMoreMirrored = async (
  pageData: any,
  lensProfile: string
): Promise<any> => {
  try {
    const { data } = await profilePublications({
      profileId: lensProfile,
      publicationTypes: ["MIRROR"],
      limit: 50,
      cursor: pageData?.next,
    });
    const arr = [...data.publications.items];
    const mirroredValues = arr.sort(
      (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
    );
    const paginatedData = data?.publications?.pageInfo;
    return { mirroredValues, paginatedData };
  } catch (err: any) {
    console.error(err);
  }
};

export default checkIfMoreMirrored;
