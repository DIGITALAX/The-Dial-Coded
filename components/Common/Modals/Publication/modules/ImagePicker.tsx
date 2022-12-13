import Emoji from "emoji-picker-react";
import { FunctionComponent } from "react";
import { ImagePickerProps } from "./../../../types/common.types";

const ImagePicker: FunctionComponent<ImagePickerProps> = ({
  imagePicker,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit content-center">
      {imagePicker === "emoji" ? <Emoji /> : ""}
    </div>
  );
};

export default ImagePicker;
