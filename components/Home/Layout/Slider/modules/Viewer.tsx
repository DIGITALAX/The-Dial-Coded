import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../../lib/lens/constants";
import { setImageViewer } from "../../../../../redux/reducers/imageViewerSlice";
import { ViewerProps } from "../types/slider.types";

const Viewer: FunctionComponent<ViewerProps> = ({
  slider,
  width,
  dispatch,
}): JSX.Element => {
  return (
    <div className="relative w-full h-full col-start-2 col-span-10 gap-3 overflow-x-scroll flex">
      {slider?.map((uri: string, index: number) => {
        return (
          <div
            key={index}
            className={`relative w-full object-cover rounded-2xl h-96 cursor-pointer active:scale-95`}
            onClick={() =>
              dispatch(setImageViewer({ actionOpen: true, actionImage: uri }))
            }
          >
            <div className={`relative w-${width} h-full rounded-2xl`}>
              <Image
                src={`${INFURA_GATEWAY}/ipfs/${uri}`}
                layout="fill"
                objectFit="cover"
                objectPosition={"center"}
                className="rounded-2xl"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Viewer;
