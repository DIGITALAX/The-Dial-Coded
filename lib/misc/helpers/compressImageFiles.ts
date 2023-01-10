import imageCompression from "browser-image-compression";

const options = {
  maxSizeMB: 0.35,
  maxWidthOrHeight: 680,
  fileType: "image/png",
};

const compressImageFiles = async (file: File): Promise<File | void> => {
  try {
    const compressedImage = await imageCompression(file, options);
    return compressedImage;
  } catch (err: any) {
    console.error(err.message);
  }
};

export default compressImageFiles;
