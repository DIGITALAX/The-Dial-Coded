import compressImageFiles from "./compressImageFiles";

const handleUploadImage = async (
  e: any,
  small: boolean
): Promise<string | void> => {
  try {
    const compressedImage = await compressImageFiles(e, small);
    const response = await fetch("/api/ipfs", {
      method: "POST",
      body: compressedImage as any,
    });
    let { cid } = await response.json();
    return "ipfs://" + cid;
  } catch (err: any) {
    console.error(err.message);
  }
};

export default handleUploadImage;
