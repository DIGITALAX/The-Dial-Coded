import { useState } from "react";
import { useDispatch } from "react-redux";
import { setDial } from "../../../../../redux/reducers/dialSlice";
import { UseSliderResults } from "../types/slider.types";

const useSlider = (): UseSliderResults => {
  const [currentValue, setCurrentValue] = useState<number>(0);
  const dispatch = useDispatch();
  const dialSettings: string[] = [
    "Scanner",
    "Highlights",
    "Drops",
    "Reach",
    "Records",
  ];
  const promptString: string[] = [
    "cybernetic style",
    "alphonse mucha",
    "studio ghibli",
    "makoto shinkai",
  ];

  const handleForward = (currentValue: number): void => {
    if (currentValue < 4) {
      setCurrentValue(currentValue + 1);
      dispatch(setDial(dialSettings[currentValue + 1]));
    }
  };

  const handleBackward = (currentValue: number): void => {
    if (currentValue > 0) {
      setCurrentValue(currentValue - 1);
      dispatch(setDial(dialSettings[currentValue - 1]));
    }
  };

  return {
    handleForward,
    handleBackward,
    currentValue,
    promptString,
  };
};

export default useSlider;
