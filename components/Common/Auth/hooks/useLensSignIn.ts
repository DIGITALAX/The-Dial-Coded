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
import { RootState } from "../../../../redux/store";
import { useLensSignInResults } from "../../types/common.types";

const useLensSignIn = (): useLensSignInResults => {
  const authStatus: boolean = useSelector(
    (state: RootState) => state.app.authStatusReducer.value
  );
  const lensProfile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile
  );
  const dispatch = useDispatch();
  const { address } = useAccount();
  const { signMessageAsync, isSuccess, isLoading, isError } = useSignMessage({
    onSettled(data, error) {
      dispatch(setSignInSettled(true));
    },
    onError(error) {
      dispatch(setGetProfileModal(true));
      dispatch(setAuthStatus(false));
      removeAuthenticationToken();
      dispatch(setHamburger(false));
    },
  });

  const handleLensLogin = async (): Promise<void> => {
    removeAuthenticationToken();
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
        await setAuthenticationToken({ token: accessTokens.data.authenticate });
        const profile = await getDefaultProfile(address);
        if (profile.data.defaultProfile !== null) {
          dispatch(setLensProfile(profile.data.defaultProfile));
          dispatch(setAuthStatus(true));
          dispatch(setSignIn(false));
          dispatch(setAccountPage("account"))
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
  };
};

export default useLensSignIn;
