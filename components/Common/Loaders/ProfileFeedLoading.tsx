import { FunctionComponent } from "react";

const ProfileFeedLoading: FunctionComponent = (): JSX.Element => {
  return (
    <div className="relative w-full h-full flex flex-col">
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
  );
};

export default ProfileFeedLoading;
