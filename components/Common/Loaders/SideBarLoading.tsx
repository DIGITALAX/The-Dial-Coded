import { FunctionComponent } from "react";

const SideBarLoading: FunctionComponent = (): JSX.Element => {
  return (
    <div className="col-start-1 relative w-full f1:w-96 h-fit f1:h-full grid grid-flow-row auto-rows-auto bg-offWhite/95 row-start-1 pl-4 f1:pl-14 pt-40 pb-10 pr-4">
      <div className="relative flex flex-col animate-pulse w-full h-fit row-start-1 self-start pr-3">
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
    </div>
  );
};

export default SideBarLoading;
