import { UseHeaderResult } from "../types/header.types";
import { setBackground } from "../../../redux/reducers/backgroundSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

const useHeader = (): UseHeaderResult => {
  const dispatch = useDispatch();
  const backgroundNumber = useSelector(
    (state: RootState) => state.app.backgroundReducer.value
  );

  const handleImageData = (): void => {
    if (backgroundNumber < 18 && backgroundNumber > 4) {
      dispatch(setBackground(backgroundNumber + 1));
    } else if (backgroundNumber === 18 || backgroundNumber <= 4) {
      dispatch(setBackground(5));
    }
  };

  return { handleImageData };
};

export default useHeader;
