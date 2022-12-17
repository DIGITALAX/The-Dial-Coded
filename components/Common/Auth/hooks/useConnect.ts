import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useDispatch } from "react-redux";
import { setHamburger } from "../../../../redux/reducers/hamburgerSlice";

const useConnect = () => {
  const dispatch = useDispatch();

  const { openConnectModal } = useConnectModal();

  const handleConnect = (): void => {
    dispatch(setHamburger(false));
    openConnectModal && openConnectModal();
  };

  return { handleConnect };
};

export default useConnect;
