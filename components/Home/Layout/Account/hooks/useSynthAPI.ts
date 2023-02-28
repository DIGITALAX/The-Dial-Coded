import { FormEvent, useEffect, useState } from "react";
import { setReplicateKey } from "../../../../../lib/replicate/utils";
import { UseSynthAPIResults } from "../types/account.types";
import LitJsSdk from "@lit-protocol/sdk-browser";
import { useDispatch, useSelector } from "react-redux";
import { setLitClient } from "../../../../../redux/reducers/litClientSlice";
import { RootState } from "../../../../../redux/store";

const useSynthAPI = (): UseSynthAPIResults => {
  const [keyValue, setKeyValue] = useState<boolean>(true);
  const [replicate, setReplicate] = useState<string>("");
  const lit = useSelector((state: RootState) => state.app.litClientReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!lit.client) {
      connectLit();
    }
  }, []);

  const connectLit = async () => {
    try {
      const client = new LitJsSdk.LitNodeClient({ debug: false });
      await client.connect();
      dispatch(
        setLitClient({
          actionClient: client,
          actionDecrypt: lit.decrypt,
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleKeyAdd = (e: FormEvent): void => {
    setReplicate((e.target as any).value);
  };

  const setKeyStorage = async (): Promise<void> => {
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: "mumbai" });
    const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(
      replicate
    );
    const encryptedSymmetricKey = await lit.client.saveEncryptionKey({
      accessControlConditions: [
        {
          contractAddress: "",
          standardContractType: "",
          chain: "mumbai",
          method: "eth_getBalance",
          parameters: [":userAddress"],
          returnValueTest: {
            comparator: ">=",
            value: "0",
          },
        },
      ],
      symmetricKey,
      authSig,
      chain: "mumbai",
    });
    const storageString = await encryptedString.arrayBuffer();
    setReplicateKey(
      JSON.stringify({
        encryptedString: JSON.stringify(
          Array.from(new Uint8Array(storageString))
        ),
        encryptedSymmetricKey: LitJsSdk.uint8arrayToString(
          encryptedSymmetricKey,
          "base16"
        ),
      })
    );
    setKeyValue(true);
  };

  return {
    handleKeyAdd,
    keyValue,
    setKeyStorage,
    setKeyValue,
  };
};

export default useSynthAPI;
