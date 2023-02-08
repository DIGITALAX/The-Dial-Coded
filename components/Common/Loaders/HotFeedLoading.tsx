import { FunctionComponent } from "react";

const HotFeedLoading: FunctionComponent = (): JSX.Element => {
  return (
    <div className="relative w-full md:w-[40vw] h-full row-start-1 col-start-1 md:col-start-2 flex flex-col gap-10">
      {Array.from(Array(4).keys()).map((index: number) => {
        return (
          <div
            className={`relative flex flex-col animate-pulse w-full h-fit row-start-1 self-start ${
              index % 2 !== 0 && "pt-6 md:pt-0"
            } `}
            key={index}
          >
            <div className="flex-1 space-y-6 py-1">
              <div className="h-2 rounded" id="load"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-2 rounded col-span-2" id="load"></div>
                  <div className="h-2 rounded col-span-1" id="load"></div>
                </div>
                <div className="h-2 rounded" id="load"></div>
              </div>
            </div>
            <div className="flex-1 space-y-6 pb-1 pt-4">
              <div className="h-2 rounded" id="load"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-2 rounded col-span-2" id="load"></div>
                  <div className="h-2 rounded col-span-1" id="load"></div>
                </div>
                <div className="h-2 rounded" id="load"></div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HotFeedLoading;
