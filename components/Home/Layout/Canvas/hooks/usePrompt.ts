import { FormEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getReplicateKey } from "../../../../../lib/replicate/utils";
import { setInsufficientFunds } from "../../../../../redux/reducers/insufficientFunds";
import { InputType, UsePromptResults } from "../types/canvas.types";

const usePrompt = (): UsePromptResults => {
  const [cfg, setCfg] = useState<string>("10");
  const [steps, setSteps] = useState<string>("60");
  const [promptLoading, setPromptLoading] = useState<boolean>(false);
  const [init, setInit] = useState<string>();
  const [strength, setStrength] = useState<string>("0.5");
  const [prompt, setPrompt] = useState<string>("");
  const [keyExists, setKeyExists] = useState<boolean>(false);
  const dispatch = useDispatch();

  const handleSendPrompt = async (): Promise<void> => {
    setPromptLoading(true);
    const input: InputType = {
      prompt: prompt,
      width: 768,
      height: 768,
      num_outputs: 1,
      num_inference_steps: Number(steps),
      guidance_scale: Number(cfg),
      init_image: init ? init : undefined,
      prompt_strength: init ? Number(strength) : undefined,
    };
    try {
      const response = await fetch("/api/replicate", {
        method: "POST",
        body: JSON.stringify({ input, token: getReplicateKey() as string }),
      });
      let responseJSON = await response.json();
      if (responseJSON === null || !responseJSON) {
        dispatch(setInsufficientFunds("prompt"));
      } else {
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setPromptLoading(false);
  };

  const CheckApi = () => {
    const value = getReplicateKey();
    if (value !== null && value !== "") {
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
  };
};

export default usePrompt;
