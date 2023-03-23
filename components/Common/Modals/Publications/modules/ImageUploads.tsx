import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../../lib/lens/constants";
import { ImageUploadProps, UploadedMedia } from "../../../types/common.types";
import { RiCloseCircleFill } from "react-icons/ri";

const ImageUploads: FunctionComponent<ImageUploadProps> = ({
  handleRemoveImage,
  postLoading,
  postImagesDispatched,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit grid grid-flow-col auto-cols-auto overflow-x-scroll">
      <div className="relative w-fit h-fit overflow-x-scroll grid grid-flow-col auto-cols-auto gap-2">
        {postImagesDispatched?.map((image: UploadedMedia, index: number) => {
          return (
            <div
              key={index}
              className={`relative w-60 h-60 border-2 border-black rounded-lg bg-spots grid grid-flow-col auto-cols-auto col-start-${
                index + 1
              }`}
            >
              <div className="relative w-full h-full flex col-start-1 grid grid-flow-col auto-cols-auto">
                {image.type !== 0 ? (
                  <Image
                    src={
                      image.type === 1
                        ? `${INFURA_GATEWAY}/ipfs/${image.cid}`
                        : `${image.cid}`
                    }
                    layout="fill"
                    objectFit="cover"
                    objectPosition={"center"}
                    className="rounded-md absolute"
                    draggable={false}
                  />
                ) : (
                  <video
                    muted
                    autoPlay
                    controls
                    className="rounded-md absolute w-full h-full object-cover"
                  >
                    <source
                      src={`${INFURA_GATEWAY}/ipfs/${image.cid}`}
                      type="video/mp4"
                    />
                  </video>
                )}
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
    </div>
  );
};

export default ImageUploads;
