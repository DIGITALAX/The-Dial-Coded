import { UseHeaderResult } from "../types/header.types";
import { setBackground } from "../../../redux/reducers/backgroundSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useAccount } from "wagmi";
import { useEffect } from "react";
import { setSignIn } from "../../../redux/reducers/signInSlice";
import { setAuthStatus } from "../../../redux/reducers/authStatusSlice";
import { setGetProfileModal } from "../../../redux/reducers/getProfileModalSlice";

const useHeader = (): UseHeaderResult => {
  const dispatch = useDispatch();
  const backgroundNumber: number = useSelector(
    (state: RootState) => state.app.backgroundReducer.value
  );
  const profileState: string = useSelector(
    (state: RootState) => state.app.authStatusReducer.value
  );
  const signInSettled: boolean = useSelector(
    (state: RootState) => state.app.signInSettledReducer.value
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
    if (profileState === "no profile" && isConnected) {
      dispatch(setGetProfileModal(true));
    }
  }, [profileState, signInSettled]);

  useEffect(() => {
    if (!isConnected) {
      dispatch(setAuthStatus("unknown"));
    }
    if (isConnected && profileState === "unknown") {
      dispatch(setSignIn(true));
    }
  }, [isConnected]);

  return { handleImageData };
};

export default useHeader;
