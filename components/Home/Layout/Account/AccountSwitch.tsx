import { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import useMain from "../Post/modules/Feed/hooks/useMain";
import useAccount from "./hooks/useAccount";
import useProfile from "./hooks/useProfile";
import AccountTab from "./modules/AccountTab";
import ProfileTab from "./modules/ProfileTab";
import StatsTab from "./modules/StatsTab";

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
    profileLoading
  } = useAccount();
  const dispatch = useDispatch();
  const { getMoreUserProfileFeed, userFeed } = useProfile();
  const profile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile
  );
  const { fetchReactions } = useMain();
  let action: string = "account";
  const decideStringAction = () => {
    if (profile) {
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
          profile={profile}
          getMoreUserProfileFeed={getMoreUserProfileFeed}
          userFeed={userFeed}
          fetchReactions={fetchReactions}
          dispatch={dispatch}
        />
      );

    case "stats":
      return <StatsTab profile={profile} />;

    case "no profile":
      return (
        <div className="relative w-fit h-fit place-self-center font-dosis text-offBlack text-base">
          Please Connect to Lens to view your Account page.
        </div>
      );

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
