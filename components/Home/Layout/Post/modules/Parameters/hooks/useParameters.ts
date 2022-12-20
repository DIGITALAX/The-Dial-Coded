import { indexOf } from "lodash";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import profilePublications from "../../../../../../../graphql/queries/profilePublication";
import { RootState } from "../../../../../../../redux/store";
import { UseParametersResult } from "../types/parameters.types";
import lodash from "lodash";

const useParameters = (): UseParametersResult => {
  const [orderDrop, setOrderDrop] = useState<boolean>(false);
  const [orderType, setTypeDrop] = useState<boolean>(false);
  const [orderPriority, setPriorityDrop] = useState<boolean>(false);
  const [userTypeOpen, setUserTypeOpen] = useState<boolean>(false);
  const userViewer = useSelector(
    (state: RootState) => state.app.userViewerReducer.value
  );

  const feedOrder: string[] = ["chrono", "algo"];

  const feedType: string[] = ["saves", "reflex", "drafts", "canvas"];

  const feedPriority: string[] = ["interests", "reactions"];

  const userList: string[] = ["emmajane", "digitalax", "f3manifesto", "alice"];
  const userId: string[] = ["0x454c", "0x84ec", "0x016305", "0x454c"];

  const [userSelectFeed, setUserSelectFeed] = useState<any[]>([]);
  const [userPaginatedResults, setUserPaginatedResults] = useState<any>();

  const getUserSelectFeed = async (): Promise<void> => {
    try {
      const { data } = await profilePublications({
        profileId: userId[indexOf(userList, userViewer)],
        publicationTypes: ["POST", "COMMENT", "MIRROR"],
        limit: 30,
      });
      const arr: any[] = [...data?.publications?.items];
      const sortedArr: any[] = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      setUserSelectFeed(sortedArr);
      setUserPaginatedResults(data?.publications?.pageInfo);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getMoreUserSelectFeed = async (): Promise<void> => {
    try {
      const { data } = await profilePublications({
        profileId: userId[indexOf(userList, userViewer)],
        publicationTypes: ["POST", "COMMENT", "MIRROR"],
        limit: 30,
        cursor: userPaginatedResults?.next,
      });

      const arr: any[] = [...data?.publications?.items];
      const sortedArr: any[] = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      setUserSelectFeed(sortedArr);
      setUserPaginatedResults(data?.publications?.pageInfo);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (userViewer !== "Select User") {
      getUserSelectFeed();
    }
  }, [userViewer]);

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
    setUserTypeOpen,
    userTypeOpen,
    userList,
    userSelectFeed,
    getMoreUserSelectFeed,
  };
};

export default useParameters;
