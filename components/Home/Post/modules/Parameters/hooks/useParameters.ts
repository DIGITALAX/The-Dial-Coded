import { UseParametersResult } from "../types/parameters.types";

const useParameters = (): UseParametersResult => {
  const feedOrder: string[] = ["chrono", "algo"];

  const feedType: string[] = ["saves", "reflex", "drafts", "canvas"];

  const feedPriority: string[] = ["interests", "reactions"];

  return { feedOrder, feedType, feedPriority };
};

export default useParameters;
