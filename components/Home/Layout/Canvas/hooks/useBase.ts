import { FormEvent, useState } from "react";
import callLexicaSearch from "../../../../../lib/lens/helpers/callLexicaSearch";

const useBase = () => {
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [searchTarget, setSearchTarget] = useState<string>("");
  const [quickSearchResults, setQuickSearchResults] = useState<any[]>([]);
  const handleKeyEnter = async (e: any): Promise<void> => {
    setSearchLoading(true);
    if (e.key === "Enter") {
      if (e.target?.value !== "" || !e.target?.value) {
        const getLexicaImages = await fetch("/api/lexica", {
          method: "POST",
          body: JSON.stringify(searchTarget),
        });
        const { json } = await getLexicaImages.json();
        setQuickSearchResults(json?.images);
      }
    }
    setSearchLoading(false);
  };

  const handleChangeSearch = (e: FormEvent) => {
    setSearchTarget((e.target as HTMLFormElement).value);
  };

  return {
    quickSearchResults,
    searchLoading,
    handleChangeSearch,
    searchTarget,
    handleKeyEnter,
  };
};

export default useBase;
