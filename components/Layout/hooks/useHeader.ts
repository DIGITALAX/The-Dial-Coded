import { UseHeaderResult } from "../types/header.types";
import { setBackground } from "../../../redux/reducers/backgroundSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { setSignIn } from "../../../redux/reducers/signInSlice";
import {
  getAuthenticationToken,
  isAuthExpired,
  refreshAuth,
  removeAuthenticationToken,
} from "../../../lib/lens/utils";
import { setLayout } from "../../../redux/reducers/layoutSlice";
import { setLensProfile } from "../../../redux/reducers/lensProfileSlice";
import { setHamburger } from "../../../redux/reducers/hamburgerSlice";
import { useRouter } from "next/router";
import useLensSignIn from "../../Common/Auth/hooks/useLensSignIn";

const useHeader = (): UseHeaderResult => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { handleRefreshProfile } = useLensSignIn();
  const [connected, setConnected] = useState(false);
  const backgroundNumber: number = useSelector(
    (state: RootState) => state.app.backgroundReducer.value
  );
  const { isConnected } = useAccount();
  const handleImageData = (): void => {
    if (backgroundNumber < 17 && backgroundNumber > 4) {
      dispatch(setBackground(backgroundNumber + 1));
    } else if (backgroundNumber === 17 || backgroundNumber <= 4) {
      dispatch(setBackground(5));
    }
  };

  const handleAccount = (): void => {
    if (router.asPath.includes("post") || router.asPath.includes("profile")) {
      router.push("/");
    }
    dispatch(setLayout("Account"));
    dispatch(setHamburger(false));
    document.getElementById("account")?.scrollIntoView({
      block: "start",
      behavior: "smooth",
    });
  };

  useEffect(() => {
    // set connect
    setConnected(isConnected);
    const token = getAuthenticationToken();
    if (isConnected && !token) {
      dispatch(setSignIn(true));
      dispatch(setLensProfile(undefined));
      removeAuthenticationToken();
    } else if (isConnected && token) {
      if (isAuthExpired(token?.exp)) {
        const refreshedAccessToken = refreshAuth();
        if (!refreshedAccessToken) {
          // try again
          dispatch(setSignIn(true));
          dispatch(setLensProfile(undefined));
          removeAuthenticationToken();
        }
      }
      handleRefreshProfile();
    }
    // check if the auth token already exists and if it does check if its expired, if it is expired try refresh token and then log them in either way automatically if not on both auth or refresh then dispatch sign in and get them to sign in
  }, [isConnected]);

  return { handleImageData, connected, handleAccount };
};

export default useHeader;
