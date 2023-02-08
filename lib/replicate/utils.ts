const REPLICATE_STORAGE_KEY = "REP_API_KEY";

export const setReplicateKey = (key: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(REPLICATE_STORAGE_KEY, key);
    return;
  }
};

export const getReplicateKey = () => {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(REPLICATE_STORAGE_KEY);
    if (!data) return null;
    return data;
  }
};
