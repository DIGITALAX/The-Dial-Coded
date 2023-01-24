import { FormEvent, FunctionComponent } from "react";
import { IoMdImages } from "react-icons/io";
import {
  AiOutlineGif,
  AiOutlineVideoCamera,
  AiOutlineLoading,
} from "react-icons/ai";
import {
  BsFillEmojiLaughingFill,
  BsToggleOff,
  BsToggleOn,
} from "react-icons/bs";
import { RiGalleryUploadLine } from "react-icons/ri";
import { setCollectOptionsModal } from "../../../../../redux/reducers/collectOptionsModalSlice";
import { PostOptionsProps } from "../../../types/common.types";
import { setImagePickerModal } from "../../../../../redux/reducers/imagePickerSlice";
import { setFollowerOnly } from "../../../../../redux/reducers/followerOnlySlice";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

const PostOptions: FunctionComponent<PostOptionsProps> = ({
  dispatch,
  imagePicker,
  uploadImage,
  imageUploading,
  postLoading,
  videoUploading,
  uploadVideo,
}): JSX.Element => {
  const followerOnly = useSelector(
    (state: RootState) => state.app.followerOnlyReducer.value
  );
  const postImages = useSelector(
    (state: RootState) => state.app.postImageReducer.value
  );
  return (
    <div className="relative w-fit h-fit flex flex-row gap-2">
      <label
        className={`relative w-fit h-fit col-start-1 place-self-center ${
          !postLoading &&
          !imageUploading &&
          (!postImages || (postImages as any)?.length < 4) &&
          "cursor-pointer active:scale-95"
        } ${imageUploading && "animate-spin"} ${
          postImages?.length === 4 && "opacity-20"
        }`}
        onChange={(e: FormEvent) => {
          !postLoading ? uploadImage(e) : {};
        }}
      >
        {!imageUploading ? (
          <IoMdImages color="white" size={20} />
        ) : (
          <AiOutlineLoading color="white" size={15} />
        )}
        <input
          type="file"
          accept="image/png"
          hidden
          required
          id="files"
          multiple={true}
          name="images"
          className="caret-transparent"
          disabled={
            imageUploading || postLoading || postImages?.length === 4
              ? true
              : false
          }
        />
      </label>
      <label
        className={`relative w-fit h-fit col-start-2 place-self-center ${
          !postLoading &&
          !videoUploading &&
          (!postImages || (postImages as any)?.length < 4) &&
          "cursor-pointer active:scale-95"
        } ${videoUploading && "animate-spin"} ${
          postImages?.length === 4 && "opacity-20"
        }`}
        onChange={(e: FormEvent) => {
          !postLoading ? uploadVideo(e) : {};
        }}
      >
        {!videoUploading ? (
          <AiOutlineVideoCamera color="white" size={20} />
        ) : (
          <AiOutlineLoading color="white" size={15} />
        )}
        <input
          type="file"
          accept="video/mp4"
          hidden
          required
          id="files"
          multiple={false}
          name="video"
          className="caret-transparent"
          disabled={
            videoUploading || postLoading || postImages?.length === 4
              ? true
              : false
          }
        />
      </label>
      <div
        className={`relative w-fit h-fit col-start-3 place-self-center ${
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
        className={`relative w-fit h-fit col-start-4 place-self-center ${
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
        className={`relative w-fit h-fit col-start-5 place-self-center ${
          !postLoading && "cursor-pointer active:scale-95"
        }`}
        onClick={() => {
          !postLoading ? dispatch(setCollectOptionsModal(true)) : {};
        }}
      >
        <RiGalleryUploadLine color="white" size={20} />
      </div>
      <div
        className={`relative w-fit h-fit col-start-6 place-self-center grid grid-flow-col auto-cols-auto ${
          !postLoading && "cursor-pointer active:scale-95"
        }`}
        onClick={() => {
          !postLoading ? dispatch(setFollowerOnly(!followerOnly)) : {};
        }}
      >
        <p
          id="toggle-followers"
          className="text-blue-600 hover:text-blue-700 transition duration-150 place-self-center w-fit h-fit col-start-1"
        >
          {!followerOnly ? (
            <BsToggleOff color="white" size={20} />
          ) : (
            <BsToggleOn color="#FA4040" size={20} />
          )}
        </p>
        <ReactTooltip
          anchorId="toggle-followers"
          place="right"
          content="Only Followers can Mirror & Comment"
          style={{
            fontSize: "9px",
            backgroundColor: "#131313",
            opacity: "0.7",
          }}
        />
      </div>
    </div>
  );
};

export default PostOptions;
