import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useContractWrite,
  usePrepareContractWrite,
  useSignTypedData,
} from "wagmi";
import mirror from "../../../../graphql/mutations/mirror";
import profilePublications from "../../../../graphql/queries/profilePublication";
import whoMirroredPublications from "../../../../graphql/queries/whoMirroredPublications";
import { LENS_HUB_PROXY_ADDRESS_MUMBAI } from "../../../../lib/lens/constants";
import { omit, splitSignature } from "../../../../lib/lens/helpers";
import { setInsufficientFunds } from "../../../../redux/reducers/insufficientFunds";
import { setReactionState } from "../../../../redux/reducers/reactionStateSlice";
import { RootState } from "../../../../redux/store";
import {
  PaginatedResultInfo,
  ProfileQueryRequest,
} from "../../types/lens.types";
import LensHubProxy from "./../../../../abis/LensHubProxy.json";

const useMirrored = () => {
  const {
    query: { id },
  } = useRouter();
  const pubId = useSelector(
    (state: RootState) => state.app.reactionStateReducer.value
  );
  const reactions = useSelector(
    (state: RootState) => state.app.reactionStateReducer
  );
  const profileId: any = useSelector(
    (state: RootState) => state?.app?.lensProfileReducer?.profile?.id
  );
  const { signTypedDataAsync } = useSignTypedData();
  const dispatch = useDispatch();
  const [mirrorLoading, setMirrorLoading] = useState<boolean>(false);
  const [mirrorInfoLoading, setMirrorInfoLoading] = useState<boolean>(false);
  const [mirrorers, setMirrorers] = useState<ProfileQueryRequest[]>([]);
  const [mirrorPageInfo, setMirrorPageInfo] = useState<PaginatedResultInfo>();
  const [mirrorArgs, setMirrorArgs] = useState<any>();

  // read mirrors
  const getPostMirrors = async (): Promise<void> => {
    setMirrorInfoLoading(true);
    try {
      const mirrors = await whoMirroredPublications({
        whoMirroredPublicationId: id ? id : pubId,
        limit: 30,
      });
      const arr: any[] = [...mirrors.data.profiles.items];
      const sortedArr: any[] = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      console.log(sortedArr)
      setMirrorers(sortedArr);
      setMirrorPageInfo(mirrors?.data.profiles.pageInfo);
    } catch (err: any) {
      console.error(err.message);
    }
    setMirrorInfoLoading(false);
  };

  const getMorePostMirrors = async (): Promise<void> => {
    try {
      const mirrors = await whoMirroredPublications({
        whoMirroredPublicationId: id ? id : pubId,
        limit: 30,
        cursor: mirrorPageInfo?.next,
      });
      const arr: any[] = [...mirrors.data.profiles.items];
      const sortedArr: any[] = arr.sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
      setMirrorers([...mirrorers, ...sortedArr]);
      setMirrorPageInfo(mirrors?.data.profiles.pageInfo);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  // write mirrors
  const { config, isSuccess } = usePrepareContractWrite({
    address: LENS_HUB_PROXY_ADDRESS_MUMBAI,
    abi: LensHubProxy,
    functionName: "mirrorWithSig",
    enabled: Boolean(mirrorArgs),
    args: [mirrorArgs],
  });

  const { writeAsync, isSuccess: mirrorComplete} = useContractWrite(config);

  const mirrorPost = async (): Promise<void> => {
    setMirrorLoading(true);
    try {
      const mirrorPost = await mirror({
        profileId: profileId,
        publicationId: id ? id : pubId,
        referenceModule: {
          followerOnlyReferenceModule: false,
        },
      });

      const typedData: any = mirrorPost.data.createMirrorTypedData.typedData;

      const signature: any = await signTypedDataAsync({
        domain: omit(typedData?.domain, ["__typename"]),
        types: omit(typedData?.types, ["__typename"]) as any,
        value: omit(typedData?.value, ["__typename"]) as any,
      });

      const { v, r, s } = splitSignature(signature);
      const mirrorArgs = {
        profileId: typedData.value.profileId,
        profileIdPointed: typedData.value.profileIdPointed,
        pubIdPointed: typedData.value.pubIdPointed,
        referenceModuleData: typedData.value.referenceModuleData,
        referenceModule: typedData.value.referenceModule,
        referenceModuleInitData: typedData.value.referenceModuleInitData,
        sig: {
          v,
          r,
          s,
          deadline: typedData.value.deadline,
        },
      };
      setMirrorArgs(mirrorArgs);
    } catch (err: any) {
      console.error(err.message);
      dispatch(setInsufficientFunds("failed"));
    }
    setMirrorLoading(false);
  };

  const mirrorWrite = async (): Promise<void> => {
    setMirrorLoading(true);
    try {
      const tx = await writeAsync?.();
      dispatch(
        setReactionState({
          actionOpen: false,
          actionType: "mirror",
          actionValue: id ? id : pubId,
        })
      );
      const res = await tx?.wait();
    } catch (err: any) {
      dispatch(setInsufficientFunds("failed"));
      console.error(err.message);
    }
    setMirrorLoading(false);
  };

  useEffect(() => {
    if (reactions.type === "mirror") {
      getPostMirrors();
    }
  }, [reactions.type, reactions.open, id, pubId, mirrorComplete]);

  useEffect(() => {
    if (isSuccess) {
      mirrorWrite();
    }
  }, [isSuccess]);

  return { mirrorInfoLoading, mirrorLoading, mirrorPost, getMorePostMirrors, mirrorers };
};

export default useMirrored;
