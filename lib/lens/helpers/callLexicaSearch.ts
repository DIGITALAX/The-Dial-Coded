import { AnyAction, Dispatch } from "redux";
import { setLexicaImages } from "../../../redux/reducers/lexicaImagesSlice";
import promptRegex from "./promptRegex";
import lodash from "lodash";
import { LexicaImages } from "../../../components/Home/Scan/types/scan.types";
import { setSearchCategories } from "../../../redux/reducers/searchCategoriesSlice";

const callLexicaSearch = async (
  searchTarget: string,
  dispatch: Dispatch<AnyAction>
): Promise<void> => {
  try {
    const getLexicaImages = await fetch("/api/lexica", {
      method: "POST",
      body: JSON.stringify(searchTarget),
    });
    const { json } = await getLexicaImages.json();
    dispatch(setLexicaImages(json?.images));
    let propsArray: string[] = [];
    lodash.filter(json?.images, (image: LexicaImages) => {
      const value: string | undefined = promptRegex(image?.prompt);
      if (value) {
        propsArray.push(value);
      }
    });
    const uniqueArr = lodash.uniq(propsArray);
    const trimArray = lodash.slice(uniqueArr, 0, 31);
    dispatch(setSearchCategories(trimArray));
  } catch (err: any) {
    console.error(err.message);
  }
};

export default callLexicaSearch;

export const callLexicaPrompts = async (
  searchTarget: string,
  setter: (e: string[]) => void
): Promise<void> => {
  try {
    const returnedPrompts = await fetch("/api/lexica", {
      method: "POST",
      body: JSON.stringify(searchTarget),
    });
    const { json } = await returnedPrompts.json();
    let promptArray: string[] = [];
    lodash.filter(json?.images, (image: LexicaImages) => {
      promptArray.push(image?.prompt);
    });
    setter(promptArray);
  } catch (err: any) {
    console.error(err.message);
  }
};
