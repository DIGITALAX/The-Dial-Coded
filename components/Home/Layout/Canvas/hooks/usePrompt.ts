import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getReplicateKey } from "../../../../../lib/replicate/utils";
import { setAddPromptImage } from "../../../../../redux/reducers/addPromptImageSlice";
import { setInitImagePrompt } from "../../../../../redux/reducers/initImagePromptSlice";
import { setInsufficientFunds } from "../../../../../redux/reducers/insufficientFunds";
import { setSynthLoading } from "../../../../../redux/reducers/synthLoadingSlice";
import { RootState } from "../../../../../redux/store";
import { InputType, UsePromptResults } from "../types/canvas.types";
import LitJsSdk from "@lit-protocol/sdk-browser";
import { setLitClient } from "../../../../../redux/reducers/litClientSlice";

const usePrompt = (): UsePromptResults => {
  const init = useSelector(
    (state: RootState) => state.app.initImagePromptReducer.value
  );
  const lit = useSelector((state: RootState) => state.app.litClientReducer);
  const [cfg, setCfg] = useState<string>("10");
  const [steps, setSteps] = useState<string>("60");
  const [strength, setStrength] = useState<string>("50");
  const [prompt, setPrompt] = useState<string>("");
  const [keyExists, setKeyExists] = useState<boolean>(false);
  const [img2img, setImg2img] = useState<boolean>(false);
  const dispatch = useDispatch();

  const handleSendPrompt = async (): Promise<void> => {
    dispatch(setSynthLoading(true));
    const input: InputType = {
      prompt: prompt,
      width: 768,
      height: 768,
      num_outputs: 1,
      num_inference_steps: Number(steps),
      guidance_scale: (Number(cfg) / 100) * 20,
    };
    try {
      await promptToReplicate(input, "stability-ai/stable-diffusion");
    } catch (err: any) {
      console.error(err.message);
    }
    dispatch(setSynthLoading(false));
  };

  const handleSendImg2Img = async () => {
    if (!init) {
      dispatch(setInsufficientFunds("marquee"));
      return;
    }
    // convert init from base64 & compress
    dispatch(setSynthLoading(true));
    const input: InputType = {
      prompt: prompt,
      width: 768,
      height: 768,
      num_outputs: 1,
      num_inference_steps: Number(steps),
      guidance_scale: (Number(cfg) / 100) * 20,
      image: init,
      prompt_strength: (100 - Number(strength)) / 100,
    };
    try {
      await promptToReplicate(input, "stability-ai/stable-diffusion-img2img");
    } catch (err: any) {
      console.error(err.message);
    }
    dispatch(setSynthLoading(false));
    dispatch(setInitImagePrompt(undefined));
  };

  const decryptKey = async (): Promise<string | undefined> => {
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
      const symmetricKey = await (client
        ? client
        : lit.client
      ).getEncryptionKey({
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

  const promptToReplicate = async (input: InputType, model: string) => {
    let decrypt: string;
    if (!lit.decrypt) {
      decrypt = (await decryptKey()) as string;
    }
    try {
      const response = await fetch("/api/replicate", {
        method: "POST",
        body: JSON.stringify({
          input,
          token: lit.decrypt ? lit.decrypt : decrypt!,
          model,
        }),
      });
      let responseJSON = await response.json();
      if (responseJSON === null || !responseJSON) {
        dispatch(setInsufficientFunds("prompt"));
      } else {
        dispatch(setAddPromptImage(responseJSON[0]));
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const CheckApi = () => {
    const value = getReplicateKey();
    if (value !== null && value !== "init_image") {
      setKeyExists(true);
    }
  };

  useEffect(() => {
    CheckApi();
  }, []);

  return {
    cfg,
    setCfg,
    steps,
    setSteps,
    handleSendPrompt,
    prompt,
    setPrompt,
    keyExists,
    img2img,
    setImg2img,
    setStrength,
    strength,
    handleSendImg2Img,
  };
};

export default usePrompt;
