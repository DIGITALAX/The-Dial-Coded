import { FormEvent, FunctionComponent } from "react";
import { IoMdImages } from "react-icons/io";
import { AiOutlineGif } from "react-icons/ai";
import { BsFillEmojiLaughingFill } from "react-icons/bs";
import { RiGalleryUploadLine } from "react-icons/ri";
import { setCollectOptionsModal } from "../../../../../redux/reducers/collectOptionsModalSlice";
import { PostOptionsProps } from "../../../types/common.types";
import { setImagePickerModal } from "../../../../../redux/reducers/imagePickerSlice";

const PostOptions: FunctionComponent<PostOptionsProps> = ({
  dispatch,
  imagePicker,
  uploadImage,
  imageUploading,
  postLoading,
}): JSX.Element => {
  return (
    <div className="relative w-fit h-fit grid grid-flow-col auto-cols-auto gap-2">
      <label
        className={`relative w-fit h-fit col-start-1 place-self-center ${
          !postLoading && "cursor-pointer active:scale-95"
        }`}
        onChange={(e: FormEvent) => {
          !postLoading ? uploadImage(e) : {};
        }}
      >
        <IoMdImages color="white" size={20} />
        <input
          type="file"
          accept="image/png"
          hidden
          required
          id="files"
          multiple={true}
          name="images"
          disabled={(imageUploading || postLoading) ? true : false}
        />
      </label>
      <div
        className={`relative w-fit h-fit col-start-2 place-self-center ${
          !postLoading && "cursor-pointer active:scale-95"
        }`}
      >
        <AiOutlineGif
          color="white"
          size={25}
          onClick={() => {
            !postLoading
              ? dispatch(
                  setImagePickerModal(imagePicker === "gif" ? "" : "gif")
                )
              : {};
          }}
        />
      </div>
      <div
        className={`relative w-fit h-fit col-start-3 place-self-center ${
          !postLoading && "cursor-pointer active:scale-95"
        }`}
        onClick={() => {
          !postLoading
            ? dispatch(
                setImagePickerModal(imagePicker === "emoji" ? "" : "emoji")
              )
            : {};
        }}
      >
        <BsFillEmojiLaughingFill color="white" size={17} />
      </div>
      <div
        className={`relative w-fit h-fit col-start-4 place-self-center ${
          !postLoading && "cursor-pointer active:scale-95"
        }`}
        onClick={() => {
          !postLoading ? dispatch(setCollectOptionsModal(true)) : {};
        }}
      >
        <RiGalleryUploadLine color="white" size={20} />
      </div>
    </div>
  );
};

export default PostOptions;