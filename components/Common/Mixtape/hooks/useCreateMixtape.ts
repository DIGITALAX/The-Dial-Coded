import { useState } from "react";
import { useDispatch } from "react-redux";
import { setMixtapeCheck } from "../../../../redux/reducers/mixtapeCheckSlice";
import { UseCreateMixtapeResults } from "../../types/common.types";

const useCreateMixtape = (): UseCreateMixtapeResults => {
  const [valueClicked, setValueClicked] = useState<boolean>(false);
  const dispatch = useDispatch();
  const checkValues: string[] = [
    "lens post url",
    "24/7 channel",
    "drop url",
    "image uri",
    "video uri",
    "music uri",
  ];

  const handleClicked = (e: boolean, value: string) => {
    setValueClicked(!e);
    dispatch(setMixtapeCheck(value));
  };
  return { checkValues, handleClicked, valueClicked };
};

export default useCreateMixtape;
