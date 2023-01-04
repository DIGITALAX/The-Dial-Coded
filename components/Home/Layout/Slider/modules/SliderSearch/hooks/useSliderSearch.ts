import { FormEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  searchPublication,
  searchPublicationAuth,
} from "../../../../../../../graphql/queries/search";
import callLexicaSearch, {
  callLexicaPrompts,
} from "../../../../../../../lib/lens/helpers/callLexicaSearch";
import checkIfFollowerOnly from "../../../../../../../lib/lens/helpers/checkIfFollowerOnly";
import getPublicationReactions from "../../../../../../../lib/lens/helpers/getPublicationsReactions";
import { setPreSearch } from "../../../../../../../redux/reducers/preSearchSlice";
import { setSearchTarget } from "../../../../../../../redux/reducers/searchTargetSlice";
import { RootState } from "../../../../../../../redux/store";
import { UseSliderSearchResults } from "../types/slidersearch.types";

const useSliderSearch = (): UseSliderSearchResults => {
  const dispatch = useDispatch();
  const lensProfile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.id
  );
  const searchTarget = useSelector(
    (state: RootState) => state.app.searchTargetReducer.value
  );
  const [prompts, setPrompts] = useState<string[]>([]);
  const [dropDown, setDropDown] = useState<boolean>(false);
  const [publicationsSearchNotDispatch, setPublicationsSearchNotDispatch] =
    useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);

  const handleChangeSearch = async (e: FormEvent): Promise<void> => {
    setSearchLoading(true);
    let searchTargetString = (e.target as HTMLFormElement)?.value;
    dispatch(setSearchTarget(searchTargetString));
    if (searchTargetString !== "") {
      setDropDown(true);
    } else {
      setDropDown(false);
      setSearchLoading(false);
      return;
    }
    let publications: any;
    try {
      if (lensProfile) {
        publications = await searchPublicationAuth({
          query: searchTargetString,
          type: "PUBLICATION",
          sources: "thedial",
          limit: 50,
        });
      } else {
        publications = await searchPublication({
          query: searchTargetString,
          type: "PUBLICATION",
          sources: "thedial",
          limit: 50,
        });
      }
      const arr: any[] = [...publications?.data?.search?.items];
      const sortedPublicationArr = arr?.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      setPublicationsSearchNotDispatch(sortedPublicationArr);
      await callLexicaPrompts(searchTarget, setPrompts);
    } catch (err: any) {
      console.error(err.message);
    }
    setSearchLoading(false);
  };

  const handleKeyEnter = async (e: any): Promise<void> => {
    setSearchLoading(true);
    if (e.key === "Enter") {
      setDropDown(false);
      const {
        mixtapeMirrors,
        reactionsFeed,
        hasCommented,
        hasMirrored,
        hasReacted,
      } = await getPublicationReactions(
        publicationsSearchNotDispatch,
        lensProfile
      );
      const followerOnly = await checkIfFollowerOnly(
        publicationsSearchNotDispatch,
        lensProfile
      );
      dispatch(
        setPreSearch({
          actionItems: publicationsSearchNotDispatch,
          actionTarget: e.target?.value,
          actionMixtapeMirrors: mixtapeMirrors,
          actionReactionsFeed: reactionsFeed,
          actionCommented: hasCommented,
          actionMirrored: hasMirrored,
          actionReacted: hasReacted,
          actionFollower: followerOnly,
        })
      );
      if (e.target?.value !== "" || !e.target?.value) {
        await callLexicaSearch(e.target?.value, dispatch);
        dispatch(setSearchTarget(e.target?.value));
      }
    }
    setSearchLoading(false);
  };

  const handleChosenSearch = async (prompt?: string): Promise<void> => {
    setSearchLoading(true);
    setDropDown(false);
    try {
      const {
        mixtapeMirrors,
        reactionsFeed,
        hasCommented,
        hasMirrored,
        hasReacted,
      } = await getPublicationReactions(
        publicationsSearchNotDispatch,
        lensProfile
      );
      const followerOnly = await checkIfFollowerOnly(
        publicationsSearchNotDispatch,
        lensProfile
      );
      dispatch(
        setPreSearch({
          actionItems: publicationsSearchNotDispatch,
          actionTarget: searchTarget,
          actionMixtapeMirrors: mixtapeMirrors,
          actionReactionsFeed: reactionsFeed,
          actionCommented: hasCommented,
          actionMirrored: hasMirrored,
          actionReacted: hasReacted,
          actionFollower: followerOnly,
        })
      );
      if (prompt) {
        dispatch(setSearchTarget(prompt as string));
      }
      await callLexicaSearch(prompt ? prompt : searchTarget, dispatch);
    } catch (err: any) {
      console.error(err.message);
    }
    setSearchLoading(false);
  };

  return {
    handleKeyEnter,
    handleChangeSearch,
    searchLoading,
    dropDown,
    handleChosenSearch,
    publicationsSearchNotDispatch,
    prompts,
  };
};

export default useSliderSearch;
