import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setImageViewer } from "../../../../redux/reducers/imageViewerSlice";
import { RootState } from "../../../../redux/store";

const ImageViewerModal: FunctionComponent = (): JSX.Element => {
  const dispatch = useDispatch();
  const media = useSelector((state: RootState) => state.app.imageViewerReducer);
  return (
    <div className="inset-0 justify-center fixed z-60 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div
        className="relative w-screen h-full col-start-1 justify-self-center grid grid-flow-col auto-cols-auto self-start cursor-pointer"
        onClick={() =>
          dispatch(
            setImageViewer({
              actionType: "",
              actionOpen: false,
              actionImage: "",
            })
          )
        }
      >
        <div className="relative w-full h-screen grid grid-flow-row auto-rows-auto py-8">
          <div className="relative w-full h-full row-start-1 grid grid-flow-col auto-cols-auto px-4">
            {media.type === "image/png" || media.type === "image/gif" ? (
              <Image src={media.image} layout="fill" objectFit="contain" />
            ) : (
              <video
                muted
                controls
                className="rounded-md absolute w-full h-full object-cover"
              >
                <source src={media.image} type="video/mp4" />
              </video>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageViewerModal;
