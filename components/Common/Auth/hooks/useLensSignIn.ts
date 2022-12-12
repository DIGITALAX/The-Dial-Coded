import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAccount, useSignMessage } from "wagmi";
import authenticate from "../../../../graphql/mutations/authenticate";
import generateChallenge from "../../../../graphql/queries/generateChallenge";
import getDefaultProfile from "../../../../graphql/queries/getDefaultProfile";
import { setAuthenticationToken } from "../../../../lib/lens/utils";
import { setAuthStatus } from "../../../../redux/reducers/authStatusSlice";
import { setLensProfile } from "../../../../redux/reducers/lensProfileSlice";
import { setSignInSettled } from "../../../../redux/reducers/signInSettledSlice";
import { setSignIn } from "../../../../redux/reducers/signInSlice";
import { RootState } from "../../../../redux/store";
import { useLensSignInResults } from "../../types/common.types";

const useLensSignIn = (): useLensSignInResults => {
  const profileState: string = useSelector(
    (state: RootState) => state.app.authStatusReducer.value
  );
  const dispatch = useDispatch();
  const { address } = useAccount();
  const { signMessageAsync, isSuccess, isLoading, isError } = useSignMessage({
    onSettled(data, error) {
      console.log("Settled", { data, error });
      dispatch(setSignInSettled(true));
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
        await setAuthenticationToken({ token: accessTokens.data.authenticate });
      }
      const profile = await getDefaultProfile(address);
      if (profile.data.defaultProfile !== null) {
        dispatch(setAuthStatus("profile"));
        dispatch(setLensProfile(profile.data.defaultProfile));
        return profile.data.defaultProfile;
      } else if (profile.data.defaultProfile === null) {
        dispatch(setAuthStatus("no profile"));
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

  return { handleLensLogin, profileState, isLoading, isError, isSuccess };
};

export default useLensSignIn;
