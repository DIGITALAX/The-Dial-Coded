import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getReplicateKey } from "../../../../../lib/replicate/utils";
import { setAddPromptImage } from "../../../../../redux/reducers/addPromptImageSlice";
import { setInsufficientFunds } from "../../../../../redux/reducers/insufficientFunds";
import { RootState } from "../../../../../redux/store";
import { InputType, UsePromptResults } from "../types/canvas.types";

const usePrompt = (): UsePromptResults => {
  const init = useSelector(
    (state: RootState) => state.app.initImagePromptReducer.value
  );
  const [cfg, setCfg] = useState<string>("10");
  const [steps, setSteps] = useState<string>("60");
  const [promptLoading, setPromptLoading] = useState<boolean>(false);
  const [strength, setStrength] = useState<string>("50");
  const [prompt, setPrompt] = useState<string>("");
  const [keyExists, setKeyExists] = useState<boolean>(false);
  const [img2img, setImg2img] = useState<boolean>(false);
  const dispatch = useDispatch();

  const handleSendPrompt = async (): Promise<void> => {
    setPromptLoading(true);
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
    setPromptLoading(false);
  };

  const handleSendImg2Img = async () => {
    if (!init) {
      dispatch(setInsufficientFunds("marquee"));
      return;
    }
    setPromptLoading(true);
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
    setPromptLoading(false);
  };

  const promptToReplicate = async (input: InputType, model: string) => {
    try {
      const response = await fetch("/api/replicate", {
        method: "POST",
        body: JSON.stringify({
          input,
          token: getReplicateKey() as string,
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
    promptLoading,
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
