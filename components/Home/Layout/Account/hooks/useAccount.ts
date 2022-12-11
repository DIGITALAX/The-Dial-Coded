import { useDispatch } from "react-redux";
import { setAccountPage } from "../../../../../redux/reducers/accountPageSlice";
import { UseAccountResult } from "../types/account.types";

const useAccount = (): UseAccountResult => {
  const accountTitles: string[] = ["account", "profile"];
  const dispatch = useDispatch();

  const handleTapeSet = (title: string): void => {
    dispatch(setAccountPage(title));
  };

  const notificationImages: string[] = [
    "QmZS3Af6ypfwrPYg8w46kjpUR8REGuGb8bj98PukM7yu87",
    "QmZS3Af6ypfwrPYg8w46kjpUR8REGuGb8bj98PukM7yu87",
    "QmZS3Af6ypfwrPYg8w46kjpUR8REGuGb8bj98PukM7yu87",
    "QmZS3Af6ypfwrPYg8w46kjpUR8REGuGb8bj98PukM7yu87",
  ];

  return { accountTitles, handleTapeSet, notificationImages };
};

export default useAccount;
