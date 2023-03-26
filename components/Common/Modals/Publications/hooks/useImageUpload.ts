import { FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPostImages } from "../../../../../redux/reducers/postImagesSlice";
import { RootState } from "../../../../../redux/store";
import lodash from "lodash";
import {
  ImageUploadResults,
  MediaType,
  UploadedMedia,
} from "../../../types/common.types";
import compressImageFiles from "../../../../../lib/misc/helpers/compressImageFiles";
import fileLimitAlert from "../../../../../lib/misc/helpers/fileLimitAlert";
import videoLimitAlert from "../../../../../lib/misc/helpers/videoLimitAlert";
import { getPostData, setPostData } from "../../../../../lib/lens/utils";
import { useRouter } from "next/router";

const useImageUpload = (): ImageUploadResults => {
  const router = useRouter();
  const isCanvas = useSelector(
    (state: RootState) => state.app.publicationReducer.canvas
  );
  const [imageUploading, setImageUploading] = useState<boolean>(false);
  const [videoUploading, setVideoUploading] = useState<boolean>(false);
  const [mappedFeaturedFiles, setMappedFeaturedFiles] = useState<
    UploadedMedia[]
  >(
    router.asPath.includes("/post/") || isCanvas
      ? []
      : JSON.parse(getPostData() || "{}").images || []
  );
  const dispatch = useDispatch();
  const imagesUploaded = useSelector(
    (state: RootState) => state.app.postImageReducer.value
  );

  const uploadImage = async (
    e: FormEvent | File,
    canvas?: boolean
  ): Promise<void> => {
    if (!canvas) {
      if ((e as any)?.target?.files?.length < 1) {
        return;
      }
    }
    let finalImages: UploadedMedia[] = [];
    setImageUploading(true);
    if (canvas) {
      try {
        const compressedImage = await compressImageFiles(e as File);
        const response = await fetch("/api/ipfs", {
          method: "POST",
          body: compressedImage as any,
        });
        let cid = await response.json();
        finalImages.push({
          cid: String(cid?.cid),
          type: MediaType.Image,
        });
        setMappedFeaturedFiles([...finalImages]);
      } catch (err: any) {
        console.error(err.message);
      }
      setImageUploading(false);
    } else {
      if (fileLimitAlert((e as any).target.files[0])) {
        setImageUploading(false);
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
              finalImages.push({
                cid: String(cid?.cid),
                type: MediaType.Image,
              });
              if (
                finalImages?.length ===
                ((e as FormEvent).target as HTMLFormElement).files?.length
              ) {
                let newArr = [...(imagesUploaded as any), ...finalImages];
                setMappedFeaturedFiles(newArr);
                if (!router.asPath.includes("/post/") && !isCanvas && !router.asPath.includes("#Canvas")) {
                  const postStorage = JSON.parse(getPostData() || "{}");
                  setPostData(
                    JSON.stringify({
                      ...postStorage,
                      images: newArr,
                    })
                  );
                }
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

  const uploadVideo = async (e: FormEvent) => {
    try {
      if ((e as any).target.files.length < 1) {
        return;
      }
      if (videoLimitAlert((e as any).target.files[0])) {
        return;
      }
      setVideoUploading(true);
      const response = await fetch("/api/ipfs", {
        method: "POST",
        body: (e.target as HTMLFormElement).files[0],
      });
      let cid = await response.json();
      let newArr = [
        ...(imagesUploaded as any),
        { cid: String(cid?.cid), type: MediaType.Video },
      ];
      setMappedFeaturedFiles(newArr);
      if (!router.asPath.includes("/post/") && !isCanvas && !router.asPath.includes("#Canvas")) {
        const postStorage = JSON.parse(getPostData() || "{}");
        setPostData(
          JSON.stringify({
            ...postStorage,
            images: newArr,
          })
        );
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setVideoUploading(false);
  };

  const handleRemoveImage = (image: UploadedMedia): void => {
    const cleanedArray = lodash.filter(
      imagesUploaded,
      (uploaded) => uploaded.cid !== image.cid
    );
    setMappedFeaturedFiles(cleanedArray);
    if (!router.asPath.includes("/post/") && !isCanvas && !router.asPath.includes("#Canvas")) {
      const postStorage = JSON.parse(getPostData() || "{}");
      setPostData(
        JSON.stringify({
          ...postStorage,
          images: cleanedArray,
        })
      );
    }
  };

  useEffect(() => {
    dispatch(setPostImages(mappedFeaturedFiles));
  }, [mappedFeaturedFiles]);

  return {
    uploadImage,
    imageUploading,
    mappedFeaturedFiles,
    handleRemoveImage,
    videoUploading,
    uploadVideo,
  };
};

export default useImageUpload;
