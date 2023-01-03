import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { setImageViewer } from "../../../../../redux/reducers/imageViewerSlice";
import { LexicaImages } from "../../../Scan/types/scan.types";
import { ViewerProps } from "../types/slider.types";

const Viewer: FunctionComponent<ViewerProps> = ({
  slider,
  width,
  dispatch,
}): JSX.Element => {
  return (
    <div className="relative w-fit h-full grid grid-flow-col auto-cols-auto col-start-2">
      <div className="relative w-full h-full col-start-1 col-span-10 gap-3 overflow-x-scroll flex">
        {slider?.map((result: LexicaImages, index: number) => {
          return (
            <div
              key={index}
              id="crt"
              className={`relative w-full object-cover rounded-2xl h-fit grid grid-flow-row auto-rows-auto`}
            >
              <div
                className={`relative w-${width} h-96 rounded-t-2xl cursor-pointer active:scale-95`}
                onClick={() =>
                  dispatch(
                    setImageViewer({
                      actionOpen: true,
                      actionImage: `${result?.src}`,
                    })
                  )
                }
              >
                <Image
                  src={`${result?.src}`}
                  layout="fill"
                  objectFit="cover"
                  objectPosition={"center"}
                  className="rounded-t-2xl relative w-full h-full"
                />
              </div>
              <div className="relative w-full h-80 bg-offBlack rounded-b-2xl grid grid-flow-row auto-rows-auto">
                <div className="relative w-full h-fit grid grid-flow-col auto-cols-auto text-center text-white font-dosis text-xs self-start p-3">
                  <div className="relative w-fit h-56 row-start-1 p-2 overflow-y-scroll">
                    {result?.prompt}
                  </div>
                  <div className="relative w-fit h-fit row-start-2 pb-2 pt-3 px-2">
                    Model: {result?.model}
                  </div>
                  <div className="relative w-fit h-fit row-start-3 p-2">
                    Guidance: {result?.guidance}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Viewer;
