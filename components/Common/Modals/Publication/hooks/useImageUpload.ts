import { FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPostImages } from "../../../../../redux/reducers/postImagesSlice";
import { RootState } from "../../../../../redux/store";
import lodash from "lodash";
import { ImageUploadResults } from "../../../types/common.types";

const useImageUpload = (): ImageUploadResults => {
  const [imageUploading, setImageUploading] = useState<boolean>(false);
  const [mappedFeaturedFiles, setMappedFeaturedFiles] = useState<string[]>([]);
  const dispatch = useDispatch();
  const imagesUploaded = useSelector(
    (state: RootState) => state.app.postImageReducer.value
  );

  const uploadImage = async (e: FormEvent): Promise<void> => {
    let finalImages: string[] = [];
    setImageUploading(true);
    Array.from((e.target as HTMLFormElement).files).map(
      async (file: any, index: number) => {
        try {
          const response = await fetch("/api/ipfs", {
            method: "POST",
            body: (e.target as HTMLFormElement).files[index],
          });
          if (response.status !== 200) {
            setImageUploading(false);
          } else {
            let cid = await response.json();
            finalImages.push(String(cid?.cid));
            setMappedFeaturedFiles([...finalImages]);
            if (
              finalImages?.length ===
              (e.target as HTMLFormElement).files?.length
            ) {
              setImageUploading(false);
            }
          }
        } catch (err: any) {
          console.error(err.message);
        }
      }
    );
  };

  const handleRemoveImage = (image: string): void => {
    console.log(imagesUploaded);
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
