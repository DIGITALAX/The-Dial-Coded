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
    "stylish streetwear in a convenience store",
    "ultra detailed vector floral illustration",
    "ray tracing reflections",
    "pen and ink",
    "hand-drawn watercolor",
    "flowers everywhere",
    "huge savage rabbit monster",
    "enigmatic",
    "graffiti tag wall background",
    "magical fantasy atmosphere",
    "lots of boats",
    "fashion magazine",
    "astronaut in a garden on a spring day",
    "inspired by byte magazine cover art",
    "space and earth alone forever",
    "cyber economics",
    "surreal time machine designed by dieter rams",
    "vintage shoes silhouette photoshoot film grading",
    "chaotic arcade at night",
    "eastman kodak color negative film 5251",
    "shibuya fashion",
    "retro anime teenager wearing hoodie",
    "chaotic hand drawing colored sketch illustration",
    "infantile graphics interior abandoned factory",
    "environmental wide shot of a crowded underground market",
    "hiding within a crowd of people",
    "messy artist's workshop",
    "personal robot weaver",
    "Interior of a photojournalist's workshop",
    "abstract halftone pattern and 3d shirt mockup",
    "augmented reality hoodie design",
    "chromatic aberration",
    "solid black pillar inside an underground lake",
    "behind the scenes on the set of a claymation movie",
    "drawing a keyframe for a new anime",
    "👩‍🚀🍄🏢🌿🍒, surrealism, architecture",
  ];

  return { more, setMore, presetOptions };
};

export default usePresets;
