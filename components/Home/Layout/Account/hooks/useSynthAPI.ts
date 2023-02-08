import { FormEvent, useState } from "react";
import { setReplicateKey } from "../../../../../lib/replicate/utils";
import { UseSynthAPIResults } from "../types/account.types";

const useSynthAPI = (): UseSynthAPIResults => {
  const [keyValue, setKeyValue] = useState<boolean>(false);
  const [replicate, setReplicate] = useState<string>("");

  const handleKeyAdd = (e: FormEvent): void => {
    setKeyValue(false);
    setReplicate((e.target as any).value);
  };

  const setKeyStorage = (): void => {
    setReplicateKey(replicate);
    setKeyValue(true);
  };

  return {
    handleKeyAdd,
    keyValue,
    setKeyStorage,
  };
};

export default useSynthAPI;
