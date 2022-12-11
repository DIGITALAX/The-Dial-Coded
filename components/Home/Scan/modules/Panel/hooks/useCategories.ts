import { UseCategoriesResults } from "../types/search.types";

const useCategories = (): UseCategoriesResults => {
  const listedCategories: string[] = [
    "lo fi",
    "pixel art",
    "cottage core",
    "synth wave",
    "retrofuturism",
    "ai art",
    "precisionism",
    "cypherpunk",
    "latent",
    "spacey",
    "late night"
  ];

  const backgroundColors: string[] = [
    "record1",
    "record2",
    "record3",
    "record4",
    "record5",
    "record6",
    "record7",
    "record8",
    "record9",
    "record10",
    "record11",
    "record12",
    "record13",
    "record14",
    "record15",
  ]

  return { listedCategories, backgroundColors };
};

export default useCategories;
