import { FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMixtapeCheck } from "../../../../../redux/reducers/mixtapeCheckSlice";
import { RootState } from "../../../../../redux/store";
import {
  PostArgsType,
  PostImage,
  UseCreateMixtapeResults,
} from "../../../../Common/types/common.types";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { setAddTrack } from "../../../../../redux/reducers/addTrackSlice";
import { setMixtapeTitle } from "../../../../../redux/reducers/mixtapeTitleSlice";
import { setMixtapeSource } from "../../../../../redux/reducers/mixtapeSourceSlice";
import createPostTypedData from "../../../../../graphql/mutations/createPost";
import { omit, splitSignature } from "../../../../../lib/lens/helpers";
import { setIndexModal } from "../../../../../redux/reducers/indexModalSlice";
import { setInsufficientFunds } from "../../../../../redux/reducers/insufficientFunds";
import checkIndexed from "../../../../../graphql/queries/checkIndexed";
import {
  useContractWrite,
  usePrepareContractWrite,
  useSignTypedData,
} from "wagmi";
import { LENS_HUB_PROXY_ADDRESS_MUMBAI } from "../../../../../lib/lens/constants";
import LensHubProxy from "../../../../../abis/LensHubProxy.json";
import { setCollectValueType } from "../../../../../redux/reducers/collectValueTypeSlice";
import useCollectionModal from "../../../../Common/Modals/Publications/hooks/useCollectionModal";
import lodash from "lodash";
import { setCompleteTrack } from "../../../../../redux/reducers/completeTrackSlice";

const useCreateMixtape = (): UseCreateMixtapeResults => {
  const [valueClicked, setValueClicked] = useState<boolean>(false);
  const defaultProfile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.id
  );
  const { handleSetCollectValues } = useCollectionModal();
  const [mixtapeLoading, setMixtapeLoading] = useState<boolean>(false);
  const [args, setArgs] = useState<any>();
  const arrays = useSelector((state: RootState) => state.app.addTrackReducer);
  const collectModuleType = useSelector(
    (state: RootState) => state?.app?.collectValueTypeReducer?.type
  );
  const check = useSelector(
    (state: RootState) => state.app.mixtapeCheckReducer.value
  );
  const mixTapeTitle = useSelector(
    (state: RootState) => state.app.mixtapeTitleReducer.value
  );
  const mixtapeSource = useSelector(
    (state: RootState) => state.app.mixtapeSourceReducer.value
  );
  const [contentURI, setContentURI] = useState<string>();
  const dispatch = useDispatch();
  const { signTypedDataAsync } = useSignTypedData();

  const { config, isSuccess: postSuccess } = usePrepareContractWrite({
    address: LENS_HUB_PROXY_ADDRESS_MUMBAI,
    abi: LensHubProxy,
    functionName: "postWithSig",
    enabled: Boolean(args),
    args: [args],
  });

  const { writeAsync, error } = useContractWrite(config);

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

  const handleTrackTitle = (e: FormEvent, index: number): void => {
    let titleArray = [...(arrays?.title as string[])];
    titleArray[index] = (e.target as HTMLFormElement).value;
    dispatch(
      setAddTrack({
        actionImageURI: arrays?.imageURI,
        actionTitle: titleArray,
      })
    );
  };

  const handleTitle = (e: FormEvent) => {
    dispatch(setMixtapeTitle((e.target as HTMLFormElement).value));
  };

  const handleSource = (e: FormEvent) => {
    dispatch(setMixtapeSource((e.target as HTMLFormElement).value));
  };

  const uploadContent = async (): Promise<string | undefined> => {
    const titleFiltered = lodash.filter(
      arrays?.title,
      (title) => title !== ("" || "TRACK NAME | SOURCE (shortened)")
    );
    const imageFiltered = lodash.filter(
      arrays?.imageURI,
      (image) => image !== ""
    );

    let newImages: PostImage[] = [];
    imageFiltered?.forEach((image) => {
      newImages.push({
        item: "ipfs://" + image,
        type: "image/png",
        altTag: image,
      });
    });

    const data = {
      version: "2.0.0",
      metadata_id: uuidv4(),
      description: mixtapeSource + "\n\n" + check + "\n\n" + titleFiltered,
      content:
        mixtapeSource +
        "\n\n" +
        check +
        "\n\n" +
        titleFiltered +
        "\n\n*Dial Mixtape*",
      external_url: "https://www.thedial.xyz/",
      image: "ipfs://" + (imageFiltered as string[])[0],
      imageMimeType: "image/png",
      name: mixTapeTitle?.slice(0, 20),
      mainContentFocus: "IMAGE",
      contentWarning: null,
      attributes: [
        {
          traitType: "string",
          key: "date",
          date: moment().format("MM/D hh:mm:ss"),
        },
      ],
      media: newImages,
      locale: "en",
      tags: ["mixtape"],
      createdOn: new Date(),
      appId: "thedial",
    };

    try {
      const response = await fetch("/api/ipfs", {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (response.status !== 200) {
      } else {
        let responseJSON = await response.json();
        setContentURI(responseJSON.cid);
        return responseJSON.cid;
      }
    } catch (err: any) {
      console.error(err.message);
    }
    return contentURI;
  };

  const generateMixtape = async (): Promise<void> => {
    let titlearr: number[] = [];
    let imgarr: number[] = [];
    lodash.filter(arrays?.title, (title, index: number) => {
      if (title !== ("" || "TRACK NAME | SOURCE (shortened)")) {
        titlearr.push(index);
      }
    });
    lodash.filter(arrays?.imageURI, (image, index: number) => {
      if (image !== "") {
        imgarr.push(index);
      }
    });
    if (
      !lodash.isEqual(imgarr, titlearr) ||
      !mixTapeTitle ||
      !mixtapeSource ||
      !check
    ) {
      dispatch(setCompleteTrack(true));
      return;
    }

    handleSetCollectValues();
    setMixtapeLoading(true);
    try {
      const contentURI = await uploadContent();
      const result: any = await createPostTypedData({
        profileId: defaultProfile,
        contentURI: "ipfs://" + contentURI,
        collectModule: collectModuleType,
        referenceModule: {
          followerOnlyReferenceModule: false,
        },
      });

      const typedData: any = result.data.createPostTypedData.typedData;

      const signature: any = await signTypedDataAsync({
        domain: omit(typedData?.domain, ["__typename"]),
        types: omit(typedData?.types, ["__typename"]) as any,
        value: omit(typedData?.value, ["__typename"]) as any,
      });

      const { v, r, s } = splitSignature(signature);

      const postArgs: PostArgsType = {
        profileId: typedData.value.profileId,
        contentURI: typedData.value.contentURI,
        collectModule: typedData.value.collectModule,
        collectModuleInitData: typedData.value.collectModuleInitData,
        referenceModule: typedData.value.referenceModule,
        referenceModuleInitData: typedData.value.referenceModuleInitData,
        sig: {
          v,
          r,
          s,
          deadline: typedData.value.deadline,
        },
      };
      setArgs(postArgs);
    } catch (err: any) {
      console.error(err.message);
    }
    setMixtapeLoading(false);
    dispatch(
      setCollectValueType({
        freeCollectModule: {
          followerOnly: false,
        },
      })
    );
  };

  const handleMixtapeWrite = async (): Promise<void> => {
    setMixtapeLoading(true);
    try {
      const tx = await writeAsync?.();
      dispatch(
        setIndexModal({
          actionValue: true,
          actionMessage: "Indexing Interaction",
        })
      );
      dispatch(setMixtapeSource(""));
      dispatch(setMixtapeTitle(""));
      dispatch(
        setAddTrack({
          actionImageURI: Array(10).fill(""),
          actionTitle: Array(10).fill("TRACK NAME | SOURCE (shortened)"),
        })
      );
      const res = await tx?.wait();
      const indexedStatus = await checkIndexed(res?.transactionHash);
      if (
        indexedStatus?.data?.hasTxHashBeenIndexed?.metadataStatus?.status ===
        "SUCCESS"
      ) {
        dispatch(
          setIndexModal({
            actionValue: true,
            actionMessage: "Successfully Indexed",
          })
        );
      } else {
        dispatch(
          setIndexModal({
            actionValue: true,
            actionMessage: "Mixtape Creation Unsuccessful, Please Try Again",
          })
        );
      }
      setTimeout(() => {
        dispatch(
          setIndexModal({
            actionValue: false,
            actionMessage: undefined,
          })
        );
      }, 3000);
    } catch (err) {
      console.error(err);
      setMixtapeLoading(false);
      dispatch(setInsufficientFunds("failed"));
    }
  };

  const handleRemoveTrack = (index: number): void => {
    let imageArray = [...(arrays?.imageURI as string[])];
    let titleArray = [...(arrays?.title as string[])];
    imageArray.splice(index, 1);
    titleArray.splice(index, 1);
    dispatch(
      setAddTrack({
        actionImageURI: imageArray,
        actionTitle: titleArray,
      })
    );
  };

  useEffect(() => {
    if (postSuccess) {
      handleMixtapeWrite();
    }
  }, [postSuccess]);

  return {
    checkValues,
    handleClicked,
    valueClicked,
    mixtapeLoading,
    handleTrackTitle,
    handleTitle,
    handleSource,
    handleRemoveTrack,
    generateMixtape,
  };
};

export default useCreateMixtape;
