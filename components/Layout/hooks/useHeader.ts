import { UseHeaderResult } from "../types/header.types";
import { setBackground } from "../../../redux/reducers/backgroundSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useAccount } from "wagmi";
import { useContext, useEffect, useState } from "react";
import { setSignIn } from "../../../redux/reducers/signInSlice";
import {
  getAuthenticationToken,
  removeAuthenticationToken,
} from "../../../lib/lens/utils";
import { setLayout } from "../../../redux/reducers/layoutSlice";
import { setLensProfile } from "../../../redux/reducers/lensProfileSlice";
import { setHamburger } from "../../../redux/reducers/hamburgerSlice";

const useHeader = (): UseHeaderResult => {
  const dispatch = useDispatch();
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
    document.getElementById("account")?.scrollIntoView({
      block: "start",
      behavior: "smooth",
    });
    dispatch(setLayout("Account"));
    dispatch(setHamburger(false));
  };

  useEffect(() => {
    const authToken = getAuthenticationToken();
    removeAuthenticationToken();
    setConnected(isConnected);
    if (isConnected && !authToken) {
      dispatch(setSignIn(true));
      dispatch(setLensProfile(undefined));
    }
    // set refresh
  }, [isConnected]);

  return { handleImageData, connected, handleAccount };
};

export default useHeader;
