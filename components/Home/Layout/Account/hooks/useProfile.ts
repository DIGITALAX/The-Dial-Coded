import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import profilePublications from "../../../../../graphql/queries/profilePublication";
import { RootState } from "../../../../../redux/store";
import { PublicationsQueryRequest } from "../../../../Common/types/lens.types";

const useProfile = () => {
  const selectProfile = useSelector(
    (state: RootState) => state.app.accountPageReducer.value
  );
  const profileId = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.id
  );
  const router = useRouter();
  const [userFeed, setUserFeed] = useState<PublicationsQueryRequest[]>([]);
  const [paginatedResults, setPaginatedResults] = useState<any>();

  const getUserProfileFeed = async () => {
    try {
      const { data } = await profilePublications({
        profileId: profileId,
        publicationTypes: ["POST", "COMMENT", "MIRROR"],
        limit: 30,
      });
      const arr: any[] = [...data?.publications?.items];
      const sortedArr: any[] = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      setUserFeed(sortedArr);
      setPaginatedResults(data?.publications?.pageInfo);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getMoreUserProfileFeed = async (): Promise<void> => {
    try {
      const { data } = await profilePublications({
        profileId: profileId,
        publicationTypes: ["POST", "COMMENT", "MIRROR"],
        limit: 30,
        cursor: paginatedResults?.next,
      });

      const arr: any[] = [...data?.publications?.items];
      const sortedArr: any[] = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      setUserFeed(sortedArr);
      setPaginatedResults(data?.publications?.pageInfo);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (selectProfile === "profile feed" || router.asPath.includes("profile")) {
      getUserProfileFeed();
    }
  }, [selectProfile]);

  return { getMoreUserProfileFeed, userFeed };
};

export default useProfile;
