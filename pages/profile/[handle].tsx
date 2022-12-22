import { NextPage } from "next";
import Image from "next/legacy/image";
import Banner from "../../components/Common/Profile/modules/Banner";
import useMain from "../../components/Home/Layout/Post/modules/Feed/hooks/useMain";
import useProfilePage from "../../components/Home/Profile/hooks/useProfilePage";
import SideBar from "../../components/Home/Profile/modules/SideBar";
import { INFURA_GATEWAY } from "../../lib/lens/constants";
import ProfileTab from "./../../components/Home/Layout/Account/modules/ProfileTab";

const Profile: NextPage = (): JSX.Element => {
  const {
    profileDataLoading,
    profileData,
    getMoreUserProfileFeed,
    userFeed,
    followLoading,
    followProfile,
    unFollowProfile,
    dispatch,
    isFollowedByMe,
    isFollowing,
  } = useProfilePage();

  const { fetchReactions, didMirror, getMoreMirrors } = useMain();

  let profileImage: string;
  if (!(profileData?.picture as any)?.original) {
    profileImage = "";
  } else if ((profileData?.picture as any)?.original) {
    if ((profileData?.picture as any)?.original?.url.includes("http")) {
      profileImage = (profileData?.picture as any)?.original.url;
    } else {
      const cut = (profileData?.picture as any)?.original?.url.split("//");
      profileImage = `${INFURA_GATEWAY}/ipfs/${cut[1]}`;
    }
  } else {
    profileImage = (profileData?.picture as any)?.uri;
  }

  return (
    <div className="relative h-full w-full bg-black/70 grid grid-flow-col auto-col-auto overflow-hidden">
      {(profileDataLoading || profileDataLoading === undefined) &&
      !profileData ? (
        <div className="relative w-full h-screen col-start-1 grid grid-flow-col auto-cols-auto"></div>
      ) : (
        <div className="relative w-full h-full grid grid-flow-row auto-rows-auto col-start-1">
          <Banner coverPicture={profileData?.coverPicture} />
          <div className="relative w-full h-fit grid grid-flow-col auto-cols-auto row-start-2">
            <div className="absolute w-fit h-fit grid grid-flow-col auto-cols-auto px-10">
              <div className="relative w-48 h-48 col-start-1 rounded-full grid grid-flow-col auto-cols-auto z-10 -top-20 border-2 border-offBlack">
                <Image
                  src={profileImage}
                  layout={"fill"}
                  objectFit="cover"
                  objectPosition={"center"}
                  className="rounded-full"
                />
              </div>
            </div>
            <SideBar
              profileData={profileData}
              followLoading={followLoading}
              followProfile={followProfile}
              unFollowProfile={unFollowProfile}
              isFollowedByMe={isFollowedByMe}
              isFollowing={isFollowing}
            />
            <div className="relative w-full h-full col-start-2 col-span-4 grid grid-flow-col auto-cols-auto px-24 py-4 bg-offWhite/90">
              <ProfileTab
                profile={profileData}
                getMoreUserProfileFeed={getMoreUserProfileFeed}
                userFeed={userFeed}
                fetchReactions={fetchReactions}
                dispatch={dispatch}
                didMirror={didMirror}
                getMoreMirrors={getMoreMirrors}
                height={undefined}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
