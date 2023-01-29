import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAccount, useSignMessage } from "wagmi";
import authenticate from "../../../../graphql/mutations/authenticate";
import generateChallenge from "../../../../graphql/queries/generateChallenge";
import getDefaultProfile from "../../../../graphql/queries/getDefaultProfile";
import {
  setAuthenticationToken,
  removeAuthenticationToken,
} from "../../../../lib/lens/utils";
import { setAccountPage } from "../../../../redux/reducers/accountPageSlice";
import { setAuthStatus } from "../../../../redux/reducers/authStatusSlice";
import { setGetProfileModal } from "../../../../redux/reducers/getProfileModalSlice";
import { setHamburger } from "../../../../redux/reducers/hamburgerSlice";
import { setLensProfile } from "../../../../redux/reducers/lensProfileSlice";
import { setSignInSettled } from "../../../../redux/reducers/signInSettledSlice";
import { setSignIn } from "../../../../redux/reducers/signInSlice";
import { setWalletConnected } from "../../../../redux/reducers/walletConnectedSlice";
import { RootState } from "../../../../redux/store";
import { useLensSignInResults } from "../../types/common.types";

const useLensSignIn = (): useLensSignInResults => {
  const authStatus: boolean = useSelector(
    (state: RootState) => state.app.authStatusReducer.value
  );
  const lensProfile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile
  );
  const router = useRouter();
  const dispatch = useDispatch();
  const { address } = useAccount();
  const { signMessageAsync, isSuccess, isLoading, isError } = useSignMessage({
    onSettled() {
      dispatch(setSignInSettled(true));
    },
    onError() {
      dispatch(setGetProfileModal(true));
      dispatch(setAuthStatus(false));
      dispatch(setHamburger(false));
    },
  });

  const handleLensLogin = async (): Promise<void> => {
    try {
      const challengeResponse = await generateChallenge(address);
      const signature = await signMessageAsync({
        message: challengeResponse.data.challenge.text,
      });
      const accessTokens = await authenticate(
        address as string,
        signature as string
      );
      if (accessTokens) {
        setAuthenticationToken({ token: accessTokens.data.authenticate });
        const profile = await getDefaultProfile(address);
        if (profile?.data) {
          dispatch(setLensProfile(profile?.data?.defaultProfile));
          dispatch(setAuthStatus(true));
          dispatch(setSignIn(false));
          dispatch(setWalletConnected(true));
          dispatch(setAccountPage("account"));
          dispatch(setHamburger(false));
        } else {
          dispatch(setGetProfileModal(true));
          dispatch(setAuthStatus(false));
          removeAuthenticationToken();
          dispatch(setHamburger(false));
        }
      }
    } catch (err: any) {
      dispatch(setGetProfileModal(true));
      dispatch(setAuthStatus(false));
      removeAuthenticationToken();
      dispatch(setHamburger(false));
      console.error(err.message);
    }
  };

  const handleRefreshProfile = async (): Promise<void> => {
    try {
      const profile = await getDefaultProfile(address);
      if (profile?.data?.defaultProfile !== null) {
        dispatch(setLensProfile(profile?.data?.defaultProfile));
        dispatch(setAuthStatus(true));
        dispatch(setSignIn(false));
        dispatch(setWalletConnected(true));
        if (router.asPath.includes("?=")) {
          let route = router.asPath?.split("?=")[1]?.split("/#")[0];
          dispatch(setAccountPage(route));
        } else {
          dispatch(setAccountPage("account"));
        }
        dispatch(setHamburger(false));
      } else {
        dispatch(setGetProfileModal(true));
        dispatch(setAuthStatus(false));
        removeAuthenticationToken();
        dispatch(setHamburger(false));
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(setSignIn(false));
    }
  }, [isSuccess]);

  return {
    handleLensLogin,
    authStatus,
    isLoading,
    isError,
    isSuccess,
    lensProfile,
    handleRefreshProfile,
  };
};

export default useLensSignIn;
