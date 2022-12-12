import { FunctionComponent } from "react";
import Connect from "./Connect";
import Profile from "./Profile";
import { AuthSwitchProps } from "../../types/common.types";

const AuthSwitch: FunctionComponent<AuthSwitchProps> = ({
  isConnected,
  profileState,
  dispatch
}): JSX.Element => {
  let action: string = "NOT_CONNECTED";
  const decideStringAction = () => {
    if (isConnected && profileState === "profile") {
      action = "PROFILE";
    }
    return action;
  };

  switch (decideStringAction()) {
    case "PROFILE":
      <Profile dispatch={dispatch} />;

    default:
      return <Connect />;
  }
};

export default AuthSwitch;
