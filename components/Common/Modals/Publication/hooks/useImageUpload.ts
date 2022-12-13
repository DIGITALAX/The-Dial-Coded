import { FormEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPostImages } from "../../../../../redux/reducers/postImagesSlice";

const useImageUpload = () => {
  const [imageUploading, setImageUploading] = useState<boolean>(false);
  const [mappedFeaturedFiles, setMappedFeaturedFiles] = useState<string[]>([]);
  const dispatch = useDispatch();

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

  useEffect(() => {
    dispatch(setPostImages(mappedFeaturedFiles));
  }, [mappedFeaturedFiles]);

  return { uploadImage, imageUploading, mappedFeaturedFiles };
};

export default useImageUpload;
