import {
  PostImage,
  UploadedMedia,
} from "../../../components/Common/types/common.types";
import lodash from "lodash";
import { v4 as uuidv4 } from "uuid";

const uploadPostContent = async (
  postImages: UploadedMedia[] | undefined,
  tags: string[],
  postDescription: string,
  isCanvas: boolean | undefined,
  setContentURI: (e: string | undefined) => void,
  contentURI: string | undefined
): Promise<string | undefined> => {
  let newImages: PostImage[] = [];
  let formattedTags: string[] = [];
  postImages?.forEach((image) => {
    newImages.push({
      item: image.type !== 2 ? "ipfs://" + image.cid : image.cid,
      type:
        image.type === 1
          ? "image/png"
          : image.type === 2
          ? "image/gif"
          : "video/mp4",
      altTag: image.cid,
    });
  });

  if (tags?.length > 0) {
    lodash.filter(tags, (tag) => {
      if (tag.length > 50) {
        formattedTags.push(tag?.substring(0, 49));
      } else {
        formattedTags.push(tag);
      }
    });
  }

  if (isCanvas) {
    if (formattedTags.length < 5) {
      formattedTags.push("dialCanvasDraft");
    } else {
      formattedTags.pop();
      formattedTags.push("dialCanvasDraft");
    }
  }

  const coverImage = lodash.filter(newImages, (image: PostImage) => {
    if (image.type === "image/png" || image.type === "image/gif") return true;
  });
  const videos = lodash.filter(newImages, (image: PostImage) => {
    if (image.type === "video/mp4") return true;
  });

  const data = {
    version: "2.0.0",
    metadata_id: uuidv4(),
    description:
      postDescription.length < 0 || postDescription.trim().length < 0
        ? null
        : postDescription,
    content:
      postDescription.length < 0 || postDescription.trim().length < 0
        ? null
        : postDescription,
    external_url: "https://www.thedial.xyz/",
    image: coverImage.length > 0 ? (coverImage[0] as any).item : null,
    imageMimeType: "image/png",
    name: postDescription ? postDescription?.slice(0, 20) : "The Dial",
    mainContentFocus:
      videos.length > 0
        ? "VIDEO"
        : newImages.length > 0
        ? "IMAGE"
        : postDescription?.length > 270
        ? "ARTICLE"
        : "TEXT_ONLY",
    contentWarning: null,
    attributes: [
      {
        traitType: "string",
        key: "date",
        date: Date.now(),
      },
    ],
    media: newImages,
    locale: "en",
    tags: formattedTags?.length > 0 ? formattedTags : null,
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

export default uploadPostContent;
