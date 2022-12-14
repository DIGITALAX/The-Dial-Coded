import { UseHeaderResult } from "../types/header.types";
import { setBackground } from "../../../redux/reducers/backgroundSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { setSignIn } from "../../../redux/reducers/signInSlice";
import {
  getAuthenticationToken,
  removeAuthenticationToken,
} from "../../../lib/lens/utils";

const useHeader = (): UseHeaderResult => {
  const dispatch = useDispatch();
  const [connected, setConnected] = useState(false);
  const backgroundNumber: number = useSelector(
    (state: RootState) => state.app.backgroundReducer.value
  );
  const { isConnected } = useAccount();

  const handleImageData = (): void => {
    if (backgroundNumber < 18 && backgroundNumber > 4) {
      dispatch(setBackground(backgroundNumber + 1));
    } else if (backgroundNumber === 18 || backgroundNumber <= 4) {
      dispatch(setBackground(5));
    }
  };

  useEffect(() => {
    const authToken = getAuthenticationToken();
    removeAuthenticationToken();
    setConnected(isConnected);
    if (isConnected && !authToken) {
      dispatch(setSignIn(true));
    }
    // set refresh
  }, [isConnected]);

  return { handleImageData, connected };
};

export default useHeader;
