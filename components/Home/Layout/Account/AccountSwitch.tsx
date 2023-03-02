import { FunctionComponent, useEffect } from "react";
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
import Conversations from "./modules/Conversations";
import useConversations from "./hooks/useConversations";
import handleHidePost from "../../../../lib/lens/helpers/handleHidePost";
import useParameters from "../Publish/modules/Parameters/hooks/useParameters";
import { useRouter } from "next/router";
import { setSearchTarget } from "../../../../redux/reducers/searchTargetSlice";
import { setChosenDMProfile } from "../../../../redux/reducers/chosenDMProfileSlice";
import SynthAPI from "./modules/SynthAPI";
import useSynthAPI from "./hooks/useSynthAPI";

const AccountSwitch: FunctionComponent = (): JSX.Element => {
  const accountType: string | undefined = useSelector(
    (state: RootState) => state.app.accountPageReducer.value
  );
  const chosenProfile = useSelector(
    (state: RootState) => state.app.chosenDMProfileReducer.profile
  );
  const client = useSelector(
    (state: RootState) => state.app.xmtpClientReducer.value
  );
  const xmtpSearch = useSelector(
    (state: RootState) => state.app.xmtpSearchReducer.value
  );
  const decryptedKey = useSelector(
    (state: RootState) => state.app.litClientReducer.decrypt
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
    followLoading,
    handleFollowModule,
    followFee,
    setFollowFee,
    value,
    setValue,
    enabledCurrencies,
    setEnabledCurrency,
    currencyDropDown,
    setCurrencyDropDown,
    enabledCurrency,
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
    mixtapeMirror,
    followerOnly,
    hasMore,
    reactionLoaded,
  } = useProfile();
  const {
    createClient,
    searchMessages,
    clientLoading,
    searchLoading,
    searchMoreMessages,
    sendConversation,
    profileSearch,
    handleMessage,
    handleChosenProfile,
    dropdown,
    previewMessages,
    profileLensData,
    conversationMessages,
    message,
    textElement,
    messageLoading,
    caretCoord,
    handleMentionClick,
    profilesOpen,
    mentionProfiles,
    handleEmoji,
    openImagePicker,
    setOpenImagePicker,
    conversationLoading,
    onNetwork,
    handleGif,
    handleSetGif,
    handleGifSubmit,
    results,
    handleUploadImage,
    allConversationsLoading,
    handleKeyEnter,
  } = useConversations();
  const {
    getMoreNotifications,
    notificationsList,
    notificationsLoading,
    hasMoreNotifications,
  } = useNotifications();
  const {
    handleKeyAdd,
    keyValue,
    setKeyStorage,
    setKeyValue,
    handleDecryptKey,
  } = useSynthAPI();
  const router = useRouter();
  const { dispatcherLoading, setDispatcherEnabled } = useParameters();
  const profile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile
  );
  const authStatus = useSelector(
    (state: RootState) => state.app.authStatusReducer.value
  );
  const isConnected = useSelector(
    (state: RootState) => state.app.walletConnectedReducer.value
  );
  const dispatcher = useSelector(
    (state: RootState) => state.app.dispatcherReducer.value
  );
  const { openConnectModal } = useConnectModal();
  let action: string = "account";
  const decideStringAction = () => {
    if (authStatus && isConnected) {
      if (router.asPath.includes("?=")) {
        let route = router.asPath?.split("?=")[1]?.split("/#")[0];
        if (route === accountType) {
          action = route;
        } else {
          action = accountType as string;
        }
      } else {
        action = accountType as string;
      }
    } else {
      action = "no profile";
    }

    return action;
  };

  useEffect(() => {
    if (action !== "conversations") {
      dispatch(setSearchTarget(""));
      dispatch(setChosenDMProfile(undefined));
    } else {
      router.replace(router.asPath, "/#Account").catch((e) => {
        if (!e.cancelled) {
          throw e;
        }
      });
    }
  }, [action]);

  switch (decideStringAction()) {
    case "profile feed":
      return (
        <div className="relative w-full h-full flex overflow-y-scroll">
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
            mixtapeMirror={mixtapeMirror}
            handleHidePost={handleHidePost}
            followerOnly={followerOnly}
            mixtapeLength={0}
            hasMore={hasMore}
            reactionLoaded={reactionLoaded}
          />
        </div>
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
          hasMoreNotifications={hasMoreNotifications}
        />
      );

    case "conversations":
      return (
        <Conversations
          createClient={createClient}
          searchMessages={searchMessages}
          clientLoading={clientLoading}
          searchLoading={searchLoading}
          profileSearch={profileSearch}
          searchMoreMessages={searchMoreMessages}
          sendConversation={sendConversation}
          handleMessage={handleMessage}
          handleChosenProfile={handleChosenProfile}
          searchTarget={xmtpSearch}
          dropdown={dropdown}
          chosenProfile={chosenProfile}
          previewMessages={previewMessages}
          profileLensData={profileLensData}
          conversationMessages={conversationMessages}
          message={message}
          textElement={textElement}
          messageLoading={messageLoading}
          caretCoord={caretCoord}
          handleMentionClick={handleMentionClick}
          profilesOpen={profilesOpen}
          mentionProfiles={mentionProfiles}
          handleEmoji={handleEmoji}
          openImagePicker={openImagePicker}
          setOpenImagePicker={setOpenImagePicker}
          conversationLoading={conversationLoading}
          client={client}
          onNetwork={onNetwork}
          handleGif={handleGif}
          handleGifSubmit={handleGifSubmit}
          results={results}
          handleSetGif={handleSetGif}
          handleUploadImage={handleUploadImage}
          allConversationsLoading={allConversationsLoading}
          handleKeyEnter={handleKeyEnter}
        />
      );

    case "synth api":
      return (
        <SynthAPI
          handleKeyAdd={handleKeyAdd}
          keyValue={keyValue}
          setKeyStorage={setKeyStorage}
          setKeyValue={setKeyValue}
          decryptedKey={decryptedKey}
          handleDecryptKey={handleDecryptKey}
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
          dispatcher={dispatcher}
          dispatcherLoading={dispatcherLoading}
          setDispatcherEnabled={setDispatcherEnabled}
          handleFollowModule={handleFollowModule}
          followLoading={followLoading}
          followFee={followFee}
          setFollowFee={setFollowFee}
          value={value}
          setValue={setValue}
          enabledCurrencies={enabledCurrencies}
          setEnabledCurrency={setEnabledCurrency}
          currencyDropDown={currencyDropDown}
          setCurrencyDropDown={setCurrencyDropDown}
          enabledCurrency={enabledCurrency}
        />
      );
  }
};

export default AccountSwitch;
