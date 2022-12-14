import { TopicInterface, UseSampleResult } from "../types/samples.types";

const useSamples = (): UseSampleResult => {
  const topics: string[] = [
    "in the style of",
    "genre",
    "format",
    "colors",
    "lighting",
    "engines",
    "design tools",
    "techniques",
    "fashion",
    "equipment",
    "descriptive",
  ];

  const inthestyleof: string[] = [
    "pixel expressionism",
    "neo precisionism",
    "web brutalism",
    "greg",
    "an inpunk graphic novel",
    "super sonic couture",
    "bushwick street style",
    "alphonse mucha",
  ];

  const genre: string[] = [
    "aetherpunk",
    "anime",
    "bricolage",
    "cassette futurism",
    "cottagecore",
    "cyberpunk",
    "dark academia",
    "digicore",
    "fantasy",
    "futuristic",
    "glitch art",
    " retro",
    " sci-fi",
    " solarpunk",
    "spacewave",
    "synthwave",
    "vaporwave",
  ];

  const format: string[] = [
    "2d",
    "3d",
    "apparel",
    "AR",
    "architecture",
    "digital",
    "film",
    "magazine",
    "oil on canvas",
    "photography",
    "print",
    "projection",
    "VR",
  ];

  const colors: string[] = [
    "analogous colors",
    "angular gradient",
    "black and white",
    "color graded",
    "complementary colors",
    "contrasting colors",
    "holographic",
    "iridescent",
    "linear gradient",
    "metallic colors",
    "monochromatic",
    "pastels",
    "radial gradient",
    "tetradic colors",
    "triadic colors",
  ];

  const lighting: string[] = [
    "ambient",
    "anamorphic",
    "atmospheric",
    "backlighting",
    "bounce",
    "butterfly",
    "cinematic",
    "diffuse",
    "directional",
    "dramatic",
    "flat",
    "halo",
    "hard",
    "loop",
    "omni",
    "practcal",
    "rembrandt",
    "side",
    "soft",
    "split",
    "spotlight",
  ];

  const engines: string[] = [
    "autocad",
    "blender",
    "cinema4d",
    "krita",
    "maya",
    "octane",
    "photoshop",
    "unity",
    "unreal",
    "zbrush",
  ];

  const designtools: string[] = [
    "aesprite",
    "affinity",
    "after effects",
    "figma",
    "illustrator",
    "photomosh",
    "photoshop",
    "playscii",
    "premier pro",
    "procreate",
    "sketch",
    "unsplash",
  ];

  const techniques: string[] = [
    "pixel expressionism",
    "neo precisionism",
    "web brutalism",
    "greg",
    "an inpunk graphic novel",
    "super sonic couture",
    "bushwick street style",
    "alphonse mucha",
  ];

  const fashion: string[] = [
    "80s",
    "90s",
    "00s",
    "athleisure",
    "bohemian / boho chic",
    "business casual",
    "chic",
    "classic",
    "cyberpunk",
    "digicore",
    "grunge",
    "minimalist",
    "patchwork",
    "punk",
    "retro",
    "streetwear",
    "techwear",
    "vintage",
  ];

  const equipment: string[] = [
    "ansible",
    "beeper",
    "chip fabricator",
    "computer",
    "loom",
    "mobile phone",
    "oscilloscope",
    "printer",
    "typewriter",
    "radio",
    "satellite",
    "silkscreen",
    "wristwatch",
  ];

  const descriptive: string[] = [
    "biographical",
    "drama",
    "essay",
    "fable",
    "fairy tale",
    "fantasy",
    "fiction",
    "folklore",
    "historical fiction",
    "horror",
    "humor",
    "legend",
    "magical realism",
    "mystery",
    "mythology",
    "narrative",
    "nonfiction",
    "poetry",
    "science fiction",
    "speech",
  ];

  const topicValues: TopicInterface = {
    inthestyleof,
    genre,
    format,
    colors,
    lighting,
    engines,
    designtools,
    techniques,
    fashion,
    equipment,
    descriptive,
  };

  return {
    topics,
    topicValues,
  };
};

export default useSamples;
