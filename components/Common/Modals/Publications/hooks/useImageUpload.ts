import { FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPostImages } from "../../../../../redux/reducers/postImagesSlice";
import { RootState } from "../../../../../redux/store";
import lodash from "lodash";
import { ImageUploadResults } from "../../../types/common.types";
import compressImageFiles from "../../../../../lib/misc/helpers/compressImageFiles";
import fileLimitAlert from "../../../../../lib/misc/helpers/fileLimitAlert";

const useImageUpload = (): ImageUploadResults => {
  const [imageUploading, setImageUploading] = useState<boolean>(false);
  const [mappedFeaturedFiles, setMappedFeaturedFiles] = useState<string[]>([]);
  const dispatch = useDispatch();
  const imagesUploaded = useSelector(
    (state: RootState) => state.app.postImageReducer.value
  );

  const uploadImage = async (
    e: FormEvent | File,
    canvas?: boolean
  ): Promise<void> => {
    let finalImages: string[] = [];
    setImageUploading(true);
    if (canvas) {
      if (fileLimitAlert(e as any)) {
        return;
      }
      try {
        const compressedImage = await compressImageFiles(e as File);
        const response = await fetch("/api/ipfs", {
          method: "POST",
          body: compressedImage as any,
        });
        let cid = await response.json();
        finalImages.push(String(cid?.cid));
        setMappedFeaturedFiles([...finalImages]);
      } catch (err: any) {
        console.error(err.message);
      }
      setImageUploading(false);
    } else {
      if (fileLimitAlert((e as any).target.files[0])) {
        return;
      }
      Array.from(((e as FormEvent).target as HTMLFormElement)?.files).map(
        async (file: any, index: number) => {
          try {
            const compressedImage = await compressImageFiles(
              (e as any).target.files[index] as File
            );
            const response = await fetch("/api/ipfs", {
              method: "POST",
              body: compressedImage as any,
            });
            if (response.status !== 200) {
              setImageUploading(false);
            } else {
              let cid = await response.json();
              finalImages.push(String(cid?.cid));
              setMappedFeaturedFiles([...finalImages]);
              if (
                finalImages?.length ===
                ((e as FormEvent).target as HTMLFormElement).files?.length
              ) {
                setImageUploading(false);
              }
            }
          } catch (err: any) {
            console.error(err.message);
          }
        }
      );
    }
  };

  const handleRemoveImage = (image: string): void => {
    const cleanedArray = lodash.filter(
      imagesUploaded,
      (uploaded) => uploaded !== image
    );
    setMappedFeaturedFiles(cleanedArray);
  };

  useEffect(() => {
    dispatch(setPostImages(mappedFeaturedFiles));
  }, [mappedFeaturedFiles]);

  return {
    uploadImage,
    imageUploading,
    mappedFeaturedFiles,
    handleRemoveImage,
  };
};

export default useImageUpload;
