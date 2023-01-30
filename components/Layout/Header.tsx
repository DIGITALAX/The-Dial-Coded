import Image from "next/image";
import { FunctionComponent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setVideo } from "../../redux/reducers/videoSlice";
import { RootState } from "../../redux/store";
import useHeader from "./hooks/useHeader";
import { INFURA_GATEWAY } from "../../lib/lens/constants";
import Connect from "../Common/Auth/modules/Connect";
import Profile from "../Common/Auth/modules/Profile";
import useLensSignIn from "../Common/Auth/hooks/useLensSignIn";
import Disconnect from "../Common/Auth/modules/Disconnect";
import { useRouter } from "next/router";
import { setHamburger } from "../../redux/reducers/hamburgerSlice";
import useNotifications from "../Home/Layout/Account/hooks/useNotifications";

const Header: FunctionComponent = (): JSX.Element => {
  const dispatch = useDispatch();
  const video = useSelector((state: RootState) => state.app.videoReducer.value);
  const currentImage = useSelector(
    (state: RootState) => state.app.backgroundReducer.value
  );
  const newNotifications = useSelector(
    (state: RootState) => state.app.notificationsReducer.value
  );
  const { handleImageData, connected, handleAccount } = useHeader();
  const { authStatus, lensProfile, handleLensLogin } = useLensSignIn();
  const hamburger = useSelector(
    (state: RootState) => state.app.hamburgerReducer.value
  );
  const { getShortNotifications } = useNotifications();
  useEffect(() => {
    if (lensProfile && authStatus) {
      getShortNotifications();
    }
  }, [lensProfile]);
  const router = useRouter();
  return (
    <div className="absolute w-full h-fit grid grid-flow-col auto-cols-auto justify-between py-10 px-6 z-20 gap-10 sm:gap-0">
      <div
        className="relative w-fit h-fit col-start-1 text-white font-dosis text-7xl row-start-1 cursor-pointer active:scale-95"
        onClick={() => router.push("/")}
      >
        THE DIAL
      </div>
      <div className="relative w-fit h-fit grid grid-flow-col auto-cols-auto col-start-1 sm:col-start-2 gap-6 justify-self-start self-center sm:justify-self-center pr-4 row-start-2 sm:row-start-1">
        {!router.asPath.includes("post") &&
          !router.asPath.includes("profile") &&
          !router.asPath.includes("mixtape") && (
            <div
              className="relative w-fit h-fit col-start-1 opacity-80 place-self-center cursor-pointer active:scale-95 hover:opacity-60"
              onClick={() => dispatch(setVideo(!video))}
            >
              <Image
                src={`${INFURA_GATEWAY}/ipfs/Qmb4h9vReob4VXMByg7Go1kUmacjuGAcTxft5Rq4SbSgXY`}
                alt="headerIcon1"
                width={50}
                height={50}
                draggable={false}
              />
            </div>
          )}
        {!router.asPath.includes("post") &&
          !router.asPath.includes("profile") &&
          !router.asPath.includes("mixtape") && (
            <div
              className="relative w-fit h-fit col-start-2 opacity-80 place-self-center cursor-pointer active:scale-95 hover:opacity-60"
              onClick={() => handleImageData(currentImage)}
            >
              <Image
                src={`${INFURA_GATEWAY}/ipfs/QmTUha42rLj2Epo3XYMi5eAyKFryt2TFEhik7jFyfzh2dp`}
                alt="headerIcon2"
                width={50}
                height={50}
                draggable={false}
              />
            </div>
          )}
        <div
          className={`relative w-full h-full grid grid-flow-col auto-cols-auto ${
            !router.asPath.includes("post") &&
            !router.asPath.includes("profile") &&
            !router.asPath.includes("mixtape")
              ? "col-start-3"
              : "md:col-start-3 col-start-2"
          }`}
        >
          {!connected ? (
            <Connect />
          ) : (
            connected && (
              <Profile
                dispatch={dispatch}
                lensProfile={lensProfile}
                authStatus={authStatus}
                newNotifications={newNotifications}
              />
            )
          )}
          {hamburger && (
            <div className="absolute row-start-2 bg-white w-fit h-fit font-dosis grid grid-flow-row auto-rows-auto gap-3 p-2 z-10 justify-self-center top-2 whitespace-nowrap rounded-md">
              <div
                className="relative text-black row-start-1 w-fit h-fit place-self-center text-xs hover:opacity-60 cursor-pointer"
                onClick={() => {
                  authStatus ? handleAccount() : handleLensLogin();
                }}
              >
                {authStatus ? "Account" : "Lens Sign In"}
              </div>
              {authStatus && (
                <div
                  className="relative text-black row-start-2 w-fit h-fit place-self-center text-xs hover:opacity-60 cursor-pointer"
                  onClick={() => {
                    router.push(
                      `/profile/${lensProfile?.handle.split(".test")[0]}`
                    );
                    dispatch(setHamburger(false));
                  }}
                >
                  Profile Feed
                </div>
              )}
              <div
                className={`relative text-black row-start-3 w-fit h-fit place-self-center text-xs hover:opacity-60 cursor-pointer ${
                  authStatus ? "row-start-3" : "row-start-2"
                }`}
              >
                <Disconnect dispatch={dispatch} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
