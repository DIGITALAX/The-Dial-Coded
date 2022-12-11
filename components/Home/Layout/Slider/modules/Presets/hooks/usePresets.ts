import { useState } from "react";
import { UsePresetsResult } from "../types/presets.types";

const usePresets = (): UsePresetsResult => {
  const [more, setMore] = useState<boolean>(false);

  const presetOptions: string[] = [
    "vintage americana",
    "Neo-Tokyo",
    "product design by Dieter Rams and by Jony Ives",
    "chatGPT",
    "techwear",
    "liquid gold",
    "trouser skirt and faux pixelated top",
    "Lower East Side golden hour sunset",
    "patchwork streetwear",
    "1970s Andor opening theme",
    "Teenage Engineering minimalissimo",
    "solarpunk",
    "AI Art profile photo",
    "10k NFT collection",
    "24/7 livestream cover art",
    "rolltop canvas bag",
    "revolutionary poster art",
    "lens culinaris cyberpunk oil on canvas",
  ];

  return { more, setMore, presetOptions };
};

export default usePresets;
