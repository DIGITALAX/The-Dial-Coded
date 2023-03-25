import { FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchProfile } from "../../../../../../../graphql/queries/search";
import { setUserViewer } from "../../../../../../../redux/reducers/userViewSlice";
import { Profile } from "../../../../../../Common/types/lens.types";
import { UseParametersResult } from "../types/parameters.types";
import lodash from "lodash";
import { setNoUserData } from "../../../../../../../redux/reducers/noUserDataSlice";
import handleDispatcher from "../../../../../../../lib/lens/helpers/handleDispatcher";
import { RootState } from "../../../../../../../redux/store";
import LensHubProxy from "./../../../../../../../abis/LensHubProxy.json";
import {
  useContractWrite,
  usePrepareContractWrite,
  useSignTypedData,
} from "wagmi";
import omit from "../../../../../../../lib/lens/helpers/omit";
import { splitSignature } from "ethers/lib/utils.js";
import { LENS_HUB_PROXY_ADDRESS_MUMBAI } from "../../../../../../../lib/lens/constants";
import { setDispatcher } from "../../../../../../../redux/reducers/dispatcherSlice";
import { setNoHotData } from "../../../../../../../redux/reducers/noHotDataSlice";

const useParameters = (): UseParametersResult => {
  const [orderDrop, setOrderDrop] = useState<boolean>(false);
  const [orderType, setTypeDrop] = useState<boolean>(false);
  const [orderPriority, setPriorityDrop] = useState<boolean>(false);
  const [userTypeOpen, setUserTypeOpen] = useState<boolean>(false);
  const feedOrder: string[] = ["chrono", "algo"];
  const feedType: string[] = ["saves", "reflex", "drafts", "canvas"];
  const feedPriority: string[] = [
    "images",
    "reactions",
    "interests",
    "video",
    "texto",
    "audio",
  ];
  const [profileSearch, setProfileSearch] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [searchTarget, setSearchTarget] = useState<string>("");
  const [pageCursor, setPageCursor] = useState<any>();
  const [dispatcherLoading, setDispatcherLoading] = useState<boolean>(false);
  const [args, setArgs] = useState<any>();
  const dispatch = useDispatch();
  const { signTypedDataAsync } = useSignTypedData();
  const profileId = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.id
  );
  const enabled = useSelector(
    (state: RootState) => state.app.dispatcherReducer.value
  );

  const { config, isSuccess } = usePrepareContractWrite({
    address: LENS_HUB_PROXY_ADDRESS_MUMBAI,
    abi: LensHubProxy,
    functionName: "setDispatcherWithSig",
    enabled: Boolean(args),
    args: [args],
  });

  const { writeAsync, isSuccess: txComplete } = useContractWrite(config);

  const searchProfiles = async (e: FormEvent): Promise<void> => {
    setSearchTarget("");
    setSearchLoading(true);
    setUserTypeOpen(true);
    if (
      (e.target as HTMLFormElement).value === "" ||
      (e.target as HTMLFormElement).value === undefined
    ) {
      dispatch(setUserViewer(undefined));
      setUserTypeOpen(false);
      setSearchLoading(false);
      dispatch(setNoUserData(false));
      dispatch(setNoHotData(false));
      return;
    }
    setSearchTarget((e.target as HTMLFormElement).value);
    try {
      const profiles = await searchProfile({
        query: (e.target as HTMLFormElement).value,
        type: "PROFILE",
        limit: 50,
      });
      setPageCursor(profiles?.data?.search?.pageInfo);
      const sortedArr = lodash.sortBy(profiles?.data?.search?.items, "handle");
      setProfileSearch(sortedArr);
    } catch (err: any) {
      console.error(err.message);
    }
    setSearchLoading(false);
  };

  const getMoreProfiles = async (): Promise<void> => {
    try {
      const moreProfiles = await searchProfile({
        query: searchTarget,
        type: "PROFILE",
        limit: 50,
        cursor: pageCursor?.next,
      });
      setPageCursor(moreProfiles?.data?.search?.pageInfo);
      const sortedArr = lodash.sortBy(
        moreProfiles?.data?.search?.items,
        "handle"
      );
      setProfileSearch([...profileSearch, ...sortedArr]);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleChosenProfile = (user: Profile): void => {
    setSearchTarget(user?.handle);
    setUserTypeOpen(false);
    dispatch(setUserViewer(user));
  };

  const setDispatcherEnabled = async () => {
    setDispatcherLoading(true);
    try {
      const typedData = await handleDispatcher(
        profileId,
        enabled ? true : false
      );
      const signature: any = await signTypedDataAsync({
        domain: omit(typedData?.domain, ["__typename"]),
        types: omit(typedData?.types, ["__typename"]) as any,
        value: omit(typedData?.value, ["__typename"]) as any,
      });

      const { v, r, s } = splitSignature(signature);
      const dispatcherArgs = {
        profileId: typedData.value.profileId,
        dispatcher: typedData.value.dispatcher,
        sig: {
          v,
          r,
          s,
          deadline: typedData.value.deadline,
        },
      };
      setArgs(dispatcherArgs);
    } catch (err: any) {
      console.error(err.message);
    }
    setDispatcherLoading(false);
  };

  const dispatcherWrite = async () => {
    setDispatcherLoading(true);
    try {
      const tx = await writeAsync?.();
      await tx?.wait();
      dispatch(setDispatcher(enabled ? false : true));
    } catch (err: any) {
      dispatch(setDispatcher(enabled));
      console.error(err.message);
    }
    setDispatcherLoading(false);
  };

  useEffect(() => {
    if (isSuccess) {
      dispatcherWrite();
    }
  }, [isSuccess]);

  return {
    feedOrder,
    feedType,
    feedPriority,
    orderDrop,
    setOrderDrop,
    orderType,
    setTypeDrop,
    orderPriority,
    setPriorityDrop,
    userTypeOpen,
    searchProfiles,
    profileSearch,
    searchLoading,
    handleChosenProfile,
    getMoreProfiles,
    searchTarget,
    setDispatcherEnabled,
    dispatcherLoading,
  };
};

export default useParameters;
