import { FormEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { searchProfile } from "../../../../../../../graphql/queries/search";
import { setUserViewer } from "../../../../../../../redux/reducers/userViewSlice";
import { Profile } from "../../../../../../Common/types/lens.types";
import { UseParametersResult } from "../types/parameters.types";
import lodash from "lodash";
import { setNoUserData } from "../../../../../../../redux/reducers/noUserDataSlice";

const useParameters = (): UseParametersResult => {
  const [orderDrop, setOrderDrop] = useState<boolean>(false);
  const [orderType, setTypeDrop] = useState<boolean>(false);
  const [orderPriority, setPriorityDrop] = useState<boolean>(false);
  const [userTypeOpen, setUserTypeOpen] = useState<boolean>(false);
  const feedOrder: string[] = ["chrono", "algo"];
  const feedType: string[] = ["saves", "reflex", "drafts", "canvas"];
  const feedPriority: string[] = ["interests", "reactions"];
  const [profileSearch, setProfileSearch] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [searchTarget, setSearchTarget] = useState<string>("");
  const [pageCursor, setPageCursor] = useState<any>();
  const [chosenProfile, setChosenProfile] = useState<any>();
  const dispatch = useDispatch();

  const searchProfiles = async (e: FormEvent): Promise<void> => {
    setSearchTarget("");
    setChosenProfile(undefined);
    setSearchLoading(true);
    setUserTypeOpen(true);
    if (
      (e.target as HTMLFormElement).value === "" ||
      (e.target as HTMLFormElement).value === undefined
    ) {
      dispatch(setUserViewer(undefined));
      setUserTypeOpen(false);
      setSearchLoading(false);
      dispatch(setNoUserData(false));
      return;
    }
    setSearchTarget((e.target as HTMLFormElement).value);
    try {
      const profiles = await searchProfile({
        query: (e.target as HTMLFormElement).value,
        type: "PROFILE",
        limit: 50,
      });
      setPageCursor(profiles?.data?.search?.pageInfo);
      const sortedArr = lodash.sortBy(profiles?.data?.search?.items, "handle");
      setProfileSearch(sortedArr);
    } catch (err: any) {
      console.error(err.message);
    }
    setSearchLoading(false);
  };

  const getMoreProfiles = async (): Promise<void> => {
    try {
      const moreProfiles = await searchProfile({
        query: searchTarget,
        type: "PROFILE",
        limit: 50,
        cursor: pageCursor?.next,
      });
      setPageCursor(moreProfiles?.data?.search?.pageInfo);
      const sortedArr = lodash.sortBy(
        moreProfiles?.data?.search?.items,
        "handle"
      );
      setProfileSearch([...profileSearch, ...sortedArr]);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleChosenProfile = (user: Profile): void => {
    setSearchTarget(user?.handle);
    setChosenProfile(user?.handle);
    setUserTypeOpen(false);
    dispatch(setUserViewer(user));
  };

  return {
    feedOrder,
    feedType,
    feedPriority,
    orderDrop,
    setOrderDrop,
    orderType,
    setTypeDrop,
    orderPriority,
    setPriorityDrop,
    userTypeOpen,
    searchProfiles,
    profileSearch,
    searchLoading,
    handleChosenProfile,
    getMoreProfiles,
    searchTarget,
  };
};

export default useParameters;
