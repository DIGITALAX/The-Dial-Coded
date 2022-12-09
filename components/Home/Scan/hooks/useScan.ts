import { useState } from "react";
import { UseScanResult } from "../types/scan.types";
import { useDispatch } from "react-redux";
import { setDial } from "../../../../redux/reducers/dialSlice";
import { setLayout } from "../../../../redux/reducers/layoutSlice";

const useScan = (): UseScanResult => {
  const [currentSetting, setCurrentSetting] = useState(1);
  const dispatch = useDispatch();

  const canvasURIs: string[] = [
    "QmQZAsmdnPUdGGhBVqWLLddLLWYF9v3oj1wjVe1S5sSm47",
    "QmaNei1oQ4AmvXgjtLFsYLBb5mwWoibFRsMtKYERSP66kt",
    "Qmct7DFwqJ5RzPCurVCKsJfvNdFp2k4tSHvyGHdw6KbGzi",
    "QmesAAdES6rPEjUeVzfjScv6r63hL7ZTA1km5ERX42anqu",
    "QmWLjgAVShfnjdyNKatkQ4AbdGgnCQjHVbpvsuaEP3QVZk",
  ];

  const mainImage: string[] = [
    "QmcDKJt29aMZeFpHtv61R4TZU1MbBXeb5RzfdoY6Ee2hsY",
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

  const setCount = (currentSetting: number): void => {
    dispatch(setDial(dialSettings[currentSetting - 1]));
    dispatch(setLayout("Slider"));
    if (currentSetting < 5) {
      setCurrentSetting(currentSetting + 1);
    } else if (currentSetting === 5) {
      setCurrentSetting(1);
    }
  };

  return {
    currentSetting,
    setCount,
    canvasURIs,
    mainImage,
    imageTitle,
    imageArtist,
    imageDescription,
  };
};

export default useScan;
