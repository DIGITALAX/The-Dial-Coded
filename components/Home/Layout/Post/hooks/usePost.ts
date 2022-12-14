import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { UsePostResult } from "../types/post.types";

const usePost = (): UsePostResult => {
  const [connected, setConnected] = useState<boolean>(false);
  const { isConnected } = useAccount();
  useEffect(() => {
    setConnected(isConnected);
  }, [isConnected]);

  return { connected };
};

export default usePost;
