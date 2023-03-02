import imageCompression from "browser-image-compression";

const options = {
  maxSizeMB: 0.35,
  maxWidthOrHeight: 680,
  fileType: "image/png",
};

const options_small = {
  maxSizeMB: 0.2,
  maxWidthOrHeight: 300,
  fileType: "image/png",
};

const compressImageFiles = async (
  file: File,
  small?: boolean
): Promise<File | void> => {
  try {
    const compressedImage = await imageCompression(
      file,
      small ? options_small : options
    );
    return compressedImage;
  } catch (err: any) {
    console.error(err);
    return file;
  }
};

export default compressImageFiles;
