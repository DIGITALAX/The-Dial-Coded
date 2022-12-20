import { useState } from "react";
import getProfilePage from "../../../../graphql/queries/getProfilePage";

const useProfilePage = () => {
  const [profileDataLoading, setProfileDataLoading] = useState<any>();
  const [profileData, setProfileData] = useState<any>();

  const getProfileData = async (handle: string): Promise<void> => {
    setProfileDataLoading(true);
    try {
      const { data } = await getProfilePage({
        handle: handle + ".test",
      });
      setProfileData(data?.profile);
    } catch (err: any) {
      console.error(err.message);
    }
    setProfileDataLoading(false);
  };
  return { profileDataLoading, getProfileData, profileData };
};

export default useProfilePage;
