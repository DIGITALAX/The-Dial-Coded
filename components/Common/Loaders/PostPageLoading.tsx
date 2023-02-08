import { FunctionComponent } from "react";

const PostPageLoading: FunctionComponent = (): JSX.Element => {
  return (
    <div className="relative h-full w-full flex flex-col">
      <div className="relative w-full h-full flex flex-col col-start-1 rounded-t-md bg-white/90 pt-72 sm:pt-56 md:pt-44 px-5 sm:px-10">
        {Array.from(Array(2).keys()).map((index: number) => {
          return (
            <div
              className={`relative flex flex-col animate-pulse w-full h-fit row-start-1 self-start pr-3 ${
                index !== 0 && "pt-10"
              }`}
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
    </div>
  );
};

export default PostPageLoading;
