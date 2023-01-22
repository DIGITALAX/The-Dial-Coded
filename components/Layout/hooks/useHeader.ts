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
  const { isConnected, address } = useAccount();
  const handleImageData = (): void => {
    if (backgroundNumber < 66 && backgroundNumber > 4) {
      dispatch(setBackground(backgroundNumber + 1));
    } else if (backgroundNumber === 66 || backgroundNumber <= 4) {
      dispatch(setBackground(5));
    }
  };

  const handleAccount = (): void => {
    router.push(`/#Account`)
    dispatch(setLayout("Account"));
    dispatch(setHamburger(false));
    document.getElementById("account")?.scrollIntoView({
      block: "start",
      behavior: "smooth",
    });
  };

  useEffect(() => {
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
          dispatch(setSignIn(true));
          dispatch(setLensProfile(undefined));
          removeAuthenticationToken();
        }
      }
      handleRefreshProfile();
    }
  }, [isConnected]);

  return { handleImageData, connected, handleAccount };
};

export default useHeader;
