import { UseScanResult } from "../types/scan.types";
import { useDispatch, useSelector } from "react-redux";
import { setDial } from "../../../../redux/reducers/dialSlice";
import { setLayout } from "../../../../redux/reducers/layoutSlice";
import { RootState } from "../../../../redux/store";
import { setBackground } from "../../../../redux/reducers/backgroundSlice";
import { useState } from "react";

const useScan = (): UseScanResult => {
  const [currentSetting, setCurrentSetting] = useState<number>(0);
  const dispatch = useDispatch();
  const backgroundNumber = useSelector(
    (state: RootState) => state.app.backgroundReducer.value
  );

  const canvasURIs: string[] = [
    "QmQZAsmdnPUdGGhBVqWLLddLLWYF9v3oj1wjVe1S5sSm47",
    "QmaNei1oQ4AmvXgjtLFsYLBb5mwWoibFRsMtKYERSP66kt",
    "Qmct7DFwqJ5RzPCurVCKsJfvNdFp2k4tSHvyGHdw6KbGzi",
    "QmesAAdES6rPEjUeVzfjScv6r63hL7ZTA1km5ERX42anqu",
    "QmWLjgAVShfnjdyNKatkQ4AbdGgnCQjHVbpvsuaEP3QVZk",
  ];

  const mainImage: string[] = [
    "QmcDKJt29aMZeFpHtv61R4TZU1MbBXeb5RzfdoY6Ee2hsY",
    "QmcuNti3wRdtbwmHGXg1S6oExw4mn2DRmK1QqkWrMh97AW",
    "QmRfz2Fp6E93mUuAH5mhYKpeVPJQAQkn7HLKkiSsWwtsd2",
    "QmWsyrjoizyX4GRYeGvJ3ecd7YDMkonDM2KBTW2bHH18VX",
    "QmP2fNq3YQ5RbeZitu8cRc1ajCeW8YbgZmkjV6Nn9VGenT",
    // other images
    "QmWkJaHuQv9LWUDE4eqDPWx4vdq55Ug5gKhHpBnLP6jex4",
    "QmfVLPL7WG3QrgJ63bK33uzG5RCAntB734vo8J2JBGSYyr",
    "QmVQDYFT9A98on8BHdDRNsnXV5e55XTurDYHg52Z6ui7CF",
    "QmbfZrJ79XhFTgBTzTb4CaZwM59EgnPuPYMcx7gtazxcdE",
    "QmUECY83LZx8eYsZ4XUNVYMQDF5Cm8iowrVTYi1vpi1Ajo",
    "QmQ4y8wbehLHjhfdp6P9VZQ88ArC7wYYe6wVXs7Di9MTzm",
    "Qma8CDZVUg5BHYzeB1PeTephfPUx8MWt7jm71YTAKS5tt3",
    "",
    "",
    "",
    "",
    "",
    "",
  ];

  const imageTitle: string[] = [
    "SOME TEXT ABOUT SITE GOES HERE",
    "",
    "",
    "",
    "",
  ];

  const imageArtist: string[] = ["MORE TEXT", "", "", "", ""];

  const imageDescription: string[] = [
    "And description sentence goes here continued on this line.",
    "",
    "",
    "",
    "",
  ];

  const dialSettings: string[] = [
    "Scanner",
    "Highlights",
    "Drops",
    "Reach",
    "Records",
  ];

  const handleCount = (): void => {
    dispatch(setDial(dialSettings[currentSetting]));
    dispatch(setLayout("Slider"));
    if (backgroundNumber < 4) {
      dispatch(setBackground(backgroundNumber + 1));
      setCurrentSetting(currentSetting + 1);
    } else if (backgroundNumber === 4) {
      dispatch(setBackground(0));
      setCurrentSetting(0);
    } else if (backgroundNumber > 4) {
      setCurrentSetting(0);
      dispatch(setBackground(0));
      dispatch(setDial(dialSettings[0]));
    }
  };

  return {
    currentSetting,
    handleCount,
    canvasURIs,
    mainImage,
    imageTitle,
    imageArtist,
    imageDescription,
  };
};

export default useScan;
