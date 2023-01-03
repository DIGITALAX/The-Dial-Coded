import { AnyAction, Dispatch } from "redux";
import { setSearchTarget } from "../../../redux/reducers/searchTargetSlice";

const handleAddtoSearch = (
  category: string,
  dispatch: Dispatch<AnyAction>,
  searchTarget: string
) => {
  dispatch(setSearchTarget(searchTarget + " " + category));
};

export default handleAddtoSearch;
