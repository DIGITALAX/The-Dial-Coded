import Emoji from "emoji-picker-react";
import { FunctionComponent } from "react";
import Grid from "../../../Giphy/Grid";
import { ImagePickerProps } from "../../../types/common.types";

const ImagePicker: FunctionComponent<ImagePickerProps> = ({
  imagePicker,
  handleEmoji,
  handleGif,
  handleGifSubmit,
  results,
  searchGif,
  handleSetGif
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit content-center py-3">
      {imagePicker === "emoji" ? (
        <Emoji onEmojiClick={handleEmoji} width={"100%"} />
      ) : (
        <Grid handleGif={handleGif} handleGifSubmit={handleGifSubmit} results={results} searchGif={searchGif} handleSetGif={handleSetGif} />
      )}
    </div>
  );
};

export default ImagePicker;
