import { NextPage } from "next";
import Image from "next/legacy/image";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useAccount } from "wagmi";
import NotFound from "../../components/Common/NotFound/NotFound";
import Banner from "../../components/Common/Profile/modules/Banner";
import useProfilePage from "../../components/Home/Profile/hooks/useProfilePage";
import SideBar from "../../components/Home/Profile/modules/SideBar";
import checkDispatcher from "../../lib/lens/helpers/checkDispatcher";
import createProfilePicture from "../../lib/lens/helpers/createProfilePicture";
import handleHidePost from "../../lib/lens/helpers/handleHidePost";
import { setWalletConnected } from "../../redux/reducers/walletConnectedSlice";
import { RootState } from "../../redux/store";
import ProfileTab from "./../../components/Home/Layout/Account/modules/ProfileTab";
import Head from "next/head";
import PostFeedLoading from "../../components/Common/Loaders/PostFeedLoading";

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
    hasMirrored,
    hasCommented,
    hasReacted,
    reactionsFeed,
    getMoreUserMixtapes,
    hotReactionsFeed,
    hasHotReacted,
    hasHotMirrored,
    hasHotCommented,
    mixtapes,
    mixtapeMirror,
    handleSendDM,
    followerOnly,
    mixtapesLoading,
    publicationsLoading,
  } = useProfilePage();
  const { isConnected } = useAccount();
  const profileId = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.id
  );
  useEffect(() => {
    dispatch(setWalletConnected(isConnected));
  }, [isConnected]);
  useEffect(() => {
    checkDispatcher(dispatch, profileId);
  }, [profileId]);

  const profileImage = createProfilePicture(profileData);

  if (!profileData && profileDataLoading === false) {
    return <NotFound />;
  }

  return (
    <div className="relative h-fit w-full bg-black/70 grid grid-flow-col auto-col-auto overflow-hidden">
      <Head>
        <title>{profileData?.name}</title>
        <meta
          name="og:url"
          content={`https://thedial.xyz/profile/${
            profileData?.handle?.split(".lens")[0]
          }`}
        />
        <meta
          name="og:title"
          content={profileData?.name ? profileData?.name : profileData?.handle}
        />
        <meta
          name="og:description"
          content={profileData?.bio ? profileData?.bio : "The Dial"}
        />
        <meta
          name="og:image"
          content={`https://thedial.infura-ipfs.io/ipfs/${profileData?.coverPicture}`}
        />
        <meta name="twitter:card" content="summary" />
        <meta
          name="og:url"
          content={`https://thedial.xyz/profile/${
            profileData?.handle?.split(".lens")[0]
          }`}
        />
        <meta
          name="og:image"
          content={`https://thedial.infura-ipfs.io/ipfs/${profileData?.coverPicture}`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@digitalax" />
        <meta name="twitter:creator" content="@digitalax" />
        <meta
          name="twitter:image"
          content={`https://thedial.infura-ipfs.io/ipfs/${profileData?.coverPicture}`}
        />
        <meta
          name="twitter:url"
          content={`https://thedial.infura-ipfs.io/ipfs/${profileData?.coverPicture}`}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="canonical"
          href={`https://thedial.infura-ipfs.io/ipfs/${profileData?.coverPicture}`}
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          rel="preload"
          href="/fonts/DosisRegular.ttf"
          as="font"
          crossOrigin=""
          type="font/ttf"
        />
        <link
          rel="preload"
          href="/fonts/DS-DIGI.ttf"
          as="font"
          crossOrigin=""
          type="font/ttf"
        />
        <link
          rel="preload"
          href="/fonts/DS-DIGIT.ttf"
          as="font"
          crossOrigin=""
          type="font/ttf"
        />
        <link
          rel="preload"
          href="/fonts/DS-DIGII.ttf"
          as="font"
          crossOrigin=""
          type="font/ttf"
        />
        <link
          rel="preload"
          href="/fonts/DS-DIGIB.ttf"
          as="font"
          crossOrigin=""
          type="font/ttf"
        />
      </Head>
      {(profileDataLoading || profileDataLoading === undefined) &&
      !profileData &&
      reactionsFeed?.length === 0 ? (
        <div className="relative w-full h-screen col-start-1 grid grid-flow-col auto-cols-auto"></div>
      ) : (
        <div className="relative w-full h-full flex flex-col col-start-1">
          <Banner coverPicture={profileData?.coverPicture} />
          <div className="relative w-full h-fit flex flex-col f1:flex-row">
            <div className="absolute w-fit h-fit grid grid-flow-col auto-cols-auto px-10">
              <div
                id="crt"
                className="relative w-48 h-48 col-start-1 rounded-full grid grid-flow-col auto-cols-auto z-10 -top-20 border-2 border-offBlack"
              >
                {profileImage && (
                  <Image
                    src={profileImage}
                    layout={"fill"}
                    objectFit="cover"
                    objectPosition={"center"}
                    className="rounded-full"
                  />
                )}
              </div>
            </div>
            <SideBar
              profileData={profileData}
              followLoading={followLoading}
              followProfile={followProfile}
              unFollowProfile={unFollowProfile}
              isFollowedByMe={isFollowedByMe}
              isFollowing={isFollowing}
              dispatch={dispatch}
              getMoreUserMixtapes={getMoreUserMixtapes}
              hotReactionsFeed={hotReactionsFeed}
              hasHotReacted={hasHotReacted}
              hasHotMirrored={hasHotMirrored}
              hasHotCommented={hasHotCommented}
              mixtapes={mixtapes}
              handleHidePost={handleHidePost}
              handleSendDM={handleSendDM}
              mixtapesLoading={mixtapesLoading}
            />
            <div
              className={`relative w-full flex px-3 fo:px-10 py-4 bg-offWhite/90 overflow-y-scroll 
              ${
                !publicationsLoading
                  ? "h-fit f1:col-start-2 f1:row-start-1 col-start-1 row-start-2"
                  : "h-full row-start-1 col-start-2"
              }`}
            >
              <ProfileTab
                getMoreUserProfileFeed={getMoreUserProfileFeed}
                userFeed={userFeed}
                dispatch={dispatch}
                height={"500rem"}
                hasMirrored={hasMirrored}
                hasCommented={hasCommented}
                hasReacted={hasReacted}
                reactionsFeed={reactionsFeed}
                mixtapeMirror={mixtapeMirror}
                handleHidePost={handleHidePost}
                followerOnly={followerOnly}
                publicationsLoading={publicationsLoading}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
