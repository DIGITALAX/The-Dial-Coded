import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
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
  const router = useRouter();
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
          actionTarget: searchTarget,
          actionMixtapeMirrors: mixtapeMirrors,
          actionReactionsFeed: reactionsFeed,
          actionCommented: hasCommented,
          actionMirrored: hasMirrored,
          actionReacted: hasReacted,
          actionFollower: followerOnly,
        })
      );
      console.log("here")
      console.log(searchTarget)
      if (searchTarget !== "" || !searchTarget) {
        await callLexicaSearch(searchTarget, dispatch);
        dispatch(setSearchTarget(searchTarget));
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
      console.log("here")
      console.log(searchTarget)
      await callLexicaSearch(prompt ? prompt : searchTarget, dispatch);
    } catch (err: any) {
      console.error(err.message);
    }
    setSearchLoading(false);
  };

  const handleHashtagSearch = async (): Promise<void> => {
    let publications: any;
    setSearchLoading(true);
    try {
      if (lensProfile) {
        publications = await searchPublicationAuth({
          query: router.asPath?.split("?search=")?.[1]?.split("/#")?.[0],
          type: "PUBLICATION",
          sources: "thedial",
          limit: 50,
        });
      } else {
        publications = await searchPublication({
          query: router.asPath?.split("?search=")?.[1]?.split("/#")?.[0],
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
      const {
        mixtapeMirrors,
        reactionsFeed,
        hasCommented,
        hasMirrored,
        hasReacted,
      } = await getPublicationReactions(sortedPublicationArr, lensProfile);
      const followerOnly = await checkIfFollowerOnly(
        sortedPublicationArr,
        lensProfile
      );
      dispatch(
        setPreSearch({
          actionItems: sortedPublicationArr,
          actionTarget: router.asPath?.split("?search=")?.[1]?.split("/#")?.[0],
          actionMixtapeMirrors: mixtapeMirrors,
          actionReactionsFeed: reactionsFeed,
          actionCommented: hasCommented,
          actionMirrored: hasMirrored,
          actionReacted: hasReacted,
          actionFollower: followerOnly,
        })
      );
      if (
        router.asPath?.split("?search=")?.[1]?.split("/#")?.[0] !== "" ||
        !router.asPath?.split("?search=")?.[1]?.split("/#")?.[0]
      ) {
        await callLexicaSearch(
          router.asPath?.split("?search=")?.[1]?.split("/#")?.[0],
          dispatch
        );
        dispatch(
          setSearchTarget(
            router.asPath?.split("?search=")?.[1]?.split("/#")?.[0]
          )
        );
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setSearchLoading(false);
  };

  useEffect(() => {
    if (
      router.asPath.includes("/#Slider") &&
      router.asPath.includes("?search=")
    ) {
      handleHashtagSearch();
    }
  }, [router.asPath]);

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
