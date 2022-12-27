import { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import useAccount from "./hooks/useAccount";
import useProfile from "./hooks/useProfile";
import AccountTab from "./modules/AccountTab";
import ProfileTab from "./modules/ProfileTab";
import StatsTab from "./modules/StatsTab";
import { setSignIn } from "../../../../redux/reducers/signInSlice";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Notifications from "./modules/Notifications";
import useNotifications from "./hooks/useNotifications";

const AccountSwitch: FunctionComponent = (): JSX.Element => {
  const accountType: string | undefined = useSelector(
    (state: RootState) => state.app.accountPageReducer.value
  );
  const {
    profileImage,
    coverImage,
    accountImageUpload,
    profileImageUploading,
    coverImageUploading,
    accountLoading,
    setProfileData,
    profileImageSet,
    profileLoading,
  } = useAccount();
  const dispatch = useDispatch();
  const {
    profileDataLoading,
    getMoreUserProfileFeed,
    userFeed,
    hasMirrored,
    hasCommented,
    hasReacted,
    reactionsFeed,
    userFollowers,
    userFollowing,
    getMoreFollowers,
    getMoreFollowing,
    followersLoading,
    followingLoading,
  } = useProfile();
  const { getMoreNotifications, notificationsList, notificationsLoading } =
    useNotifications();
  const profile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile
  );
  const isConnected = useSelector(
    (state: RootState) => state.app.walletConnectedReducer.value
  );
  const { openConnectModal } = useConnectModal();
  let action: string = "account";
  const decideStringAction = () => {
    if (profile && isConnected) {
      action = accountType as string;
    } else {
      action = "no profile";
    }

    return action;
  };

  switch (decideStringAction()) {
    case "profile feed":
      return (
        <ProfileTab
          getMoreUserProfileFeed={getMoreUserProfileFeed}
          userFeed={userFeed}
          dispatch={dispatch}
          height={"44rem"}
          hasMirrored={hasMirrored}
          hasCommented={hasCommented}
          hasReacted={hasReacted}
          reactionsFeed={reactionsFeed}
          profileDataLoading={profileDataLoading}
        />
      );

    case "stats":
      return (
        <StatsTab
          profile={profile}
          userFollowing={userFollowing}
          userFollowers={userFollowers}
          getMoreFollowers={getMoreFollowers}
          getMoreFollowing={getMoreFollowing}
          followersLoading={followersLoading}
          followingLoading={followingLoading}
        />
      );

    case "notifications":
      return (
        <Notifications
          getMoreNotifications={getMoreNotifications}
          notificationsList={notificationsList}
          notificationsLoading={notificationsLoading}
        />
      );

    case "no profile":
      return (
        <div
          className="relative w-fit h-fit place-self-center font-dosis text-offBlack text-base cursor-pointer"
          onClick={
            !isConnected ? openConnectModal : () => dispatch(setSignIn(true))
          }
        >
          Please Connect to Lens to view your Account page.
        </div>
      );

    case undefined:
      return <></>;

    default:
      return (
        <AccountTab
          profile={profile}
          accountImageUpload={accountImageUpload}
          profileImageUploading={profileImageUploading}
          coverImageUploading={coverImageUploading}
          profileImage={profileImage}
          coverImage={coverImage}
          accountLoading={accountLoading}
          setProfileData={setProfileData}
          profileImageSet={profileImageSet}
          profileLoading={profileLoading}
        />
      );
  }
};

export default AccountSwitch;
