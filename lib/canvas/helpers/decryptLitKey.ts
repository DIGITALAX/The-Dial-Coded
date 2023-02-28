import { AnyAction, Dispatch } from "redux";
import {
  LitClientState,
  setLitClient,
} from "../../../redux/reducers/litClientSlice";
import LitJsSdk from "@lit-protocol/sdk-browser";
import { getReplicateKey } from "../../replicate/utils";

const decryptLitKey = async (
  dispatch: Dispatch<AnyAction>,
  lit: LitClientState
): Promise<string | undefined> => {
  try {
    let client;
    if (!lit.client) {
      client = new LitJsSdk.LitNodeClient({ debug: false });
      await client.connect();
      dispatch(
        setLitClient({
          actionClient: client,
          actionDecrypt: lit.decrypt,
        })
      );
    }
    const authSig = await LitJsSdk.checkAndSignAuthMessage({
      chain: "mumbai",
    });
    const symmetricKey = await (client ? client : lit.client).getEncryptionKey({
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
      toDecrypt: JSON.parse(getReplicateKey()!)?.encryptedSymmetricKey,
      chain: "mumbai",
      authSig,
    });
    const uintString = new Uint8Array(
      JSON.parse(JSON.parse(getReplicateKey()!)?.encryptedString)
    ).buffer;
    const blob = new Blob([uintString], { type: "text/plain" });
    const decryptString = await LitJsSdk.decryptString(blob, symmetricKey);
    dispatch(
      setLitClient({
        actionClient: client ? client : lit.client,
        actionDecrypt: decryptString,
      })
    );
    return decryptString;
  } catch (err: any) {
    console.error(err);
  }
};

export default decryptLitKey;
