import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../../lib/lens/constants";
import { ImageUploadProps } from "../../../types/common.types";
import { RiCloseCircleFill } from "react-icons/ri";

const ImageUploads: FunctionComponent<ImageUploadProps> = ({
  mappedFeaturedFiles,
  handleRemoveImage,
  postLoading,
  postImagesDispatched,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit overflow-x-scroll grid grid-flow-col auto-cols-auto gap-2">
      {(mappedFeaturedFiles?.length === 0
        ? postImagesDispatched
        : mappedFeaturedFiles
      )?.map((image: string, index: number) => {
        console.log(image);
        return (
          <div
            key={index}
            className={`relative w-60 h-60 border-2 border-black rounded-lg grid grid-flow-col auto-cols-auto col-start-${
              index + 1
            }`}
          >
            <div className="relative w-full h-full flex col-start-1 grid grid-flow-col auto-cols-auto">
              <Image
                src={`${INFURA_GATEWAY}/ipfs/${image}`}
                layout="fill"
                objectFit="cover"
                objectPosition={"center"}
                className="rounded-md absolute"
              />
              <div
                className={`relative w-fit h-fit col-start-1 justify-self-end self-start p-px ${
                  !postLoading && "cursor-pointer active:scale-95"
                }`}
                onClick={() => {
                  !postLoading ? handleRemoveImage(image) : {};
                }}
              >
                <RiCloseCircleFill color="white" size={28} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ImageUploads;
