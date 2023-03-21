import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getReplicateKey } from "../../../../../lib/replicate/utils";
import { setAddPromptImage } from "../../../../../redux/reducers/addPromptImageSlice";
import { setInitImagePrompt } from "../../../../../redux/reducers/initImagePromptSlice";
import { setInsufficientFunds } from "../../../../../redux/reducers/insufficientFunds";
import { setSynthLoading } from "../../../../../redux/reducers/synthLoadingSlice";
import { RootState } from "../../../../../redux/store";
import {
  InputTypeReplicate,
  UsePromptResults,
  InputTypeAutomatic,
} from "../types/canvas.types";
import decryptLitKey from "../../../../../lib/canvas/helpers/decryptLitKey";

const usePrompt = (): UsePromptResults => {
  const init = useSelector(
    (state: RootState) => state.app.initImagePromptReducer.value
  );
  const synthLoading = useSelector(
    (state: RootState) => state.app.synthLoadingReducer.value
  );
  const lit = useSelector((state: RootState) => state.app.litClientReducer);
  const [cfg, setCfg] = useState<string>("10");
  const [steps, setSteps] = useState<string>("60");
  const [strength, setStrength] = useState<string>("50");
  const [prompt, setPrompt] = useState<string>("");
  const [negativePrompt, setNegativePrompt] = useState<string>("");
  const [batchSize, setBatchSize] = useState<string>("1");
  const [keyExists, setKeyExists] = useState<boolean>(false);
  const [localRunning, setLocalRunning] = useState<boolean>(true);
  const [img2img, setImg2img] = useState<boolean>(false);
  const [apiType, setApiType] = useState<boolean>(false);
  const [synthProgress, setSynthProgress] = useState<number>(0);
  const [restoreFaces, setRestoreFaces] = useState<boolean>(false);
  const [samplers, setSamplers] = useState<any[]>([]);
  const [sampler, setSampler] = useState<string>("Euler a");
  const [openSampler, setOpenSampler] = useState<boolean>(false);
  const [seed, setSeed] = useState<number>(-1);
  const [width, setWidth] = useState<number>(512);
  const [height, setHeight] = useState<number>(512);
  const [openWidth, setOpenWidth] = useState<boolean>(false);
  const [openHeight, setOpenHeight] = useState<boolean>(false);
  const dispatch = useDispatch();

  const handleSendPrompt = async (replicate: boolean): Promise<void> => {
    dispatch(setSynthLoading(true));
    try {
      if (replicate) {
        const input: InputTypeReplicate = {
          prompt: prompt,
          width: Number(width),
          height: Number(height),
          num_outputs: 1,
          num_inference_steps: Number(steps),
          guidance_scale: (Number(cfg) / 100) * 20,
        };
        await promptToReplicate(input, "stability-ai/stable-diffusion");
      } else {
        const input: InputTypeAutomatic = {
          prompt: prompt,
          steps: Number(steps),
          cfg_scale: (Number(cfg) / 100) * 20,
          negative_prompt: negativePrompt,
          batch_size: Number(batchSize),
          restore_faces: restoreFaces,
          sampler_name: sampler,
          seed,
          width: Number(width),
          height: Number(height),
        };
        await promptToAutomatic(input, "sdapi/v1/txt2img");
      }
    } catch (err: any) {
      console.error(err.message);
    }
    dispatch(setSynthLoading(false));
  };

  const handleSendImg2Img = async (replicate: boolean) => {
    if (!init) {
      dispatch(setInsufficientFunds("marquee"));
      return;
    }
    // convert init from base64 & compress
    dispatch(setSynthLoading(true));
    try {
      if (replicate) {
        const input: InputTypeReplicate = {
          prompt: prompt,
          width: Number(width),
          height: Number(height),
          num_outputs: 1,
          num_inference_steps: Number(steps),
          guidance_scale: (Number(cfg) / 100) * 20,
          image: init,
          prompt_strength: (100 - Number(strength)) / 100,
        };
        await promptToReplicate(input, "stability-ai/stable-diffusion-img2img");
      } else {
        const input: InputTypeAutomatic = {
          init_images: [init],
          prompt: prompt,
          steps: Number(steps),
          cfg_scale: (Number(cfg) / 100) * 20,
          negative_prompt: negativePrompt,
          batch_size: Number(batchSize),
          image_cfg_scale: (100 - Number(strength)) / 100,
          restore_faces: restoreFaces,
          sampler_name: sampler,
          seed,
          width: Number(width),
          height: Number(height),
        };
        await promptToAutomatic(input, "sdapi/v1/img2img");
      }
    } catch (err: any) {
      console.error(err.message);
    }
    dispatch(setSynthLoading(false));
    dispatch(setInitImagePrompt(undefined));
  };

  const promptToReplicate = async (
    input: InputTypeReplicate,
    model: string
  ): Promise<void> => {
    let decrypt: string;
    if (!lit.decrypt) {
      decrypt = (await decryptLitKey(dispatch, lit)) as string;
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
        dispatch(
          setAddPromptImage({
            actionURL: responseJSON[0],
            actionLocal: false,
          })
        );
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const promptToAutomatic = async (
    input: InputTypeAutomatic,
    model: string
  ): Promise<void> => {
    try {
      const response = await fetch("/api/automatic", {
        method: "POST",
        body: JSON.stringify({
          input,
          model,
        }),
      });
      const responseJSON = await response.json();
      if (responseJSON === null || !responseJSON) {
        dispatch(setInsufficientFunds("automatic"));
      } else {
        for (const i of responseJSON.json.images) {
          dispatch(
            setAddPromptImage({
              actionURL: i,
              actionLocal: true,
            })
          );
        }
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const checkSynthProgress = async (): Promise<void> => {
    try {
      if (synthLoading) {
        while (true) {
          const response = await fetch(
            "http://127.0.0.1:7860/sdapi/v1/progress",
            {
              method: "GET",
            }
          );
          const responseJSON = await response.json();
          setSynthProgress(responseJSON.progress);
          if (responseJSON.progress.toFixed(1) === "0.9") {
            return;
          }
        }
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    checkSynthProgress();
  }, [synthLoading]);

  const checkApi = () => {
    const value = getReplicateKey();
    if (value !== null && value !== "init_image") {
      setKeyExists(true);
    }
  };

  const checkLocal = async () => {
    try {
      const response = await fetch("http://127.0.0.1:7860");
      if (response?.status === 200) {
        setLocalRunning(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getSamplers = async () => {
    try {
      const response = await fetch("http://127.0.0.1:7860/sdapi/v1/samplers", {
        method: "GET",
      });
      const responseJSON = await response.json();
      setSamplers(responseJSON);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (!apiType && samplers.length <= 0) {
      getSamplers();
    }
  }, [apiType, samplers]);

  useEffect(() => {
    if (apiType) {
      if (
        Number(width) !== 256 &&
        Number(width) !== 512 &&
        Number(width) !== 768
      ) {
        setWidth(512);
      }
      if (
        Number(height) !== 256 &&
        Number(height) !== 512 &&
        Number(height) !== 768
      ) {
        setHeight(512);
      }
    }
  }, [apiType]);

  useEffect(() => {
    checkApi();
    checkLocal();
  }, [keyExists]);

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
    apiType,
    setApiType,
    localRunning,
    setNegativePrompt,
    setBatchSize,
    batchSize,
    synthProgress,
    restoreFaces,
    sampler,
    setSampler,
    setRestoreFaces,
    openSampler,
    setOpenSampler,
    seed,
    setSeed,
    width,
    setWidth,
    height,
    setHeight,
    setOpenHeight,
    openHeight,
    openWidth,
    setOpenWidth,
    samplers,
  };
};

export default usePrompt;
