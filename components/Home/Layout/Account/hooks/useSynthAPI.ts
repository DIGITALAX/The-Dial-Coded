import { FormEvent, useState } from "react";
import { setReplicateKey } from "../../../../../lib/replicate/utils";
import { UseSynthAPIResults } from "../types/account.types";

const useSynthAPI = (): UseSynthAPIResults => {
  const [keyValue, setKeyValue] = useState<boolean>(true);
  const [replicate, setReplicate] = useState<string>("");

  const handleKeyAdd = (e: FormEvent): void => {
    setReplicate((e.target as any).value);
  };

  const setKeyStorage = (): void => {
    setReplicateKey(replicate);
  };

  return {
    handleKeyAdd,
    keyValue,
    setKeyStorage,
    setKeyValue
  };
};

export default useSynthAPI;
