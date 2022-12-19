import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useAccount } from "wagmi";
import { setWalletConnected } from "../../../../../redux/reducers/walletConnectedSlice";
import { UsePostResult } from "../types/post.types";

const usePost = (): UsePostResult => {
  const [connected, setConnected] = useState<boolean>(false);
  const dispatch = useDispatch();
  const { isConnected } = useAccount();
  useEffect(() => {
    setConnected(isConnected);
    dispatch(setWalletConnected(isConnected));
  }, [isConnected]);

  return { connected };
};

export default usePost;
