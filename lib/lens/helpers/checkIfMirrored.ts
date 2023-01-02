import lodash from "lodash";
import { profilePublications } from "../../../graphql/queries/profilePublication";
import checkIfMoreMirrored from "./checkIfMoreMirrored";

const checkIfMirrored = async (
  arr: any[],
  lensProfile: string
): Promise<any> => {
  try {
    const { data } = await profilePublications({
      profileId: lensProfile,
      publicationTypes: ["MIRROR"],
      limit: 50,
    });
    const array_data = [...data.publications.items];
    const sortedArr = array_data.sort(
      (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
    );
    let mirroredArray: any[] = sortedArr;
    let loopMirroredArray: any[] = sortedArr;
    let pageData: any;
    while (loopMirroredArray.length === 50) {
      const { mirroredValues, paginatedData } = await checkIfMoreMirrored(
        pageData ? pageData : data?.publications?.pageInfo,
        lensProfile
      );
      loopMirroredArray = mirroredValues;
      pageData = paginatedData;
      mirroredArray = [...mirroredArray, ...mirroredValues];
    }
    let hasMirroredArr: boolean[] = [];
    for (let i = 0; i < arr.length; i++) {
      const mirrorLength = lodash.filter(
        mirroredArray,
        (mirror) => mirror?.mirrorOf?.id === arr[i]?.id
      );
      if (mirrorLength?.length > 0) {
        hasMirroredArr.push(true);
      } else {
        hasMirroredArr.push(false);
      }
    }
    return hasMirroredArr;
  } catch (err: any) {
    console.error(err);
  }
};

export default checkIfMirrored;
