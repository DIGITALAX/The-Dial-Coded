import { FormEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import fileLimitAlert from "../../../../../lib/misc/helpers/fileLimitAlert";
import compressImageFiles from "../../../../../lib/misc/helpers/compressImageFiles";
import { setAddTrack } from "../../../../../redux/reducers/addTrackSlice";
import { RootState } from "../../../../../redux/store";
import { UseMixtapeImagesResults } from "../../../../Common/types/common.types";

const useMixtapeImages = (): UseMixtapeImagesResults => {
  const dispatch = useDispatch();
  const arrays = useSelector((state: RootState) => state.app.addTrackReducer);
  const [imageLoading, setImageLoading] = useState<boolean[]>(
    Array(arrays?.title?.length).fill(false)
  );

  const uploadImage = async (e: FormEvent, index: number): Promise<void> => {
    if ((e as any).target.files.length < 1) {
      return;
    }
    if (fileLimitAlert((e as any).target.files[0])) {
      return;
    }
    let imageArray = [...(arrays?.imageURI as string[])];
    let loadingArray = [...imageLoading];
    loadingArray[index] = true;
    setImageLoading(loadingArray);
    try {
      const compressedImage = await compressImageFiles(
        (e.target as HTMLFormElement).files[0]
      );
      const response = await fetch("/api/ipfs", {
        method: "POST",
        body: compressedImage as any,
      });
      let cid = await response.json();
      imageArray[index] = String(cid?.cid);
    } catch (err: any) {
      console.error(err.message);
    }
    dispatch(
      setAddTrack({
        actionImageURI: imageArray,
        actionTitle: arrays?.title,
      })
    );
    loadingArray[index] = false;
    setImageLoading(loadingArray);
  };

  const handleRemoveImage = (index: number): void => {
    let imageArray: string[] = [...(arrays?.imageURI as string[])];
    imageArray[index] = "";
    dispatch(
      setAddTrack({
        actionImageURI: imageArray,
        actionTitle: arrays?.title,
      })
    );
  };

  return { handleRemoveImage, uploadImage, imageLoading };
};

export default useMixtapeImages;
