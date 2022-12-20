import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Banner from "../../components/Common/Profile/modules/Banner";
import useProfilePage from "../../components/Home/Profile/hooks/useProfilePage";

const Profile: NextPage = (): JSX.Element => {
  const {
    query: { handle },
  } = useRouter();

  const { getProfileData, profileDataLoading, profileData } = useProfilePage();

  useEffect(() => {
    if (handle) {
      getProfileData(handle as string);
    }
  }, [handle]);

  return (
    <div className="relative h-screen w-full bg-black opacity-70 grid grid-flow-row auto-rows-[auto auto] overflow-hidden">
      {!profileDataLoading || profileDataLoading !== undefined ? (
        <Banner coverPicture={profileData?.coverPicture} />
      ) : (
        "loading page"
      )}
    </div>
  );
};

export default Profile;
