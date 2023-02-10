import { useState } from "react";

const usePatterns = () => {
  const [patternType, setPatternType] = useState<string>();
  const [template, setTemplate] = useState<string>();
  const [showPatternDrawOptions, setShowPatternDrawOptions] =
    useState<boolean>(false);

  return {
    template,
    patternType,
    setPatternType,
    setTemplate,
    setShowPatternDrawOptions,
    showPatternDrawOptions,
  };
};

export default usePatterns;
