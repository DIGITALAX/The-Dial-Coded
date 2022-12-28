import { FunctionComponent } from "react";
import { useDisconnect } from "wagmi";
import { removeAuthenticationToken } from "../../../../lib/lens/utils";
import { setHamburger } from "../../../../redux/reducers/hamburgerSlice";
import { setLensProfile } from "../../../../redux/reducers/lensProfileSlice";
import { setWalletConnected } from "../../../../redux/reducers/walletConnectedSlice";
import { DisconnectProps } from "../../types/common.types";

const Disconnect: FunctionComponent<DisconnectProps> = ({
  dispatch,
}): JSX.Element => {
  const { disconnect } = useDisconnect();
  return (
    <div
      className="relative text-black row-start-2 w-fit h-fit place-self-center text-xs hover:opacity-60 cursor-pointer"
      style={{ display: "flex", gap: 1, zIndex: "30" }}
      onClick={() => {
        disconnect();
        dispatch(setWalletConnected(false));
        dispatch(setHamburger(false));
      }}
    >
      Disconnect Wallet
    </div>
  );
};

export default Disconnect;
