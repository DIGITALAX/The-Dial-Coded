import { FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSearchTarget } from "../../../../../../../redux/reducers/searchTargetSlice";
import { RootState } from "../../../../../../../redux/store";
import { UseSliderSearchResults } from "../types/slidersearch.types";

const useSliderSearch = (): UseSliderSearchResults => {
  const dispatch = useDispatch();
  const publicationsSearch = useSelector(
    (state: RootState) => state.app.preSearchReducer.items
  );
  const handleChangeSearch = (e: FormEvent): void => {
    let searchTargetString = (e.target as HTMLFormElement)?.value;
    dispatch(setSearchTarget(searchTargetString));
  };

  const handleKeyEnter = (e: any): void => {};

  const handleSearchLexica = async (): Promise<void> => {
    try {
    } catch (err: any) {
      console.error(err.message);
    }
  };

  return { handleKeyEnter, handleChangeSearch };
};

export default useSliderSearch;
