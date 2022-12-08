import { UseCategoriesResults } from "../types/search.types";

const useCategories = (): UseCategoriesResults => {
  const listedCategories: string[] = [
    "lo fi",
    "pixel art",
    "cottage core",
    "synth wave",
    "retrofuturism",
    "ai art",
  ];

  return { listedCategories };
};

export default useCategories;
