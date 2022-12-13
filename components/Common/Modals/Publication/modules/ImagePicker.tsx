import Emoji from "emoji-picker-react";
import { FunctionComponent } from "react";
import { ImagePickerProps } from "./../../../types/common.types";

const ImagePicker: FunctionComponent<ImagePickerProps> = ({
  imagePicker,
  handleEmoji,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit content-center py-3">
      {imagePicker === "emoji" ? <Emoji onEmojiClick={handleEmoji} /> : ""}
    </div>
  );
};

export default ImagePicker;
