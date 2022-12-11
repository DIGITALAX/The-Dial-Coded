import { FunctionComponent } from "react";
import Interface from "../../../Common/Interface/Interface";
import useMixtape from "./hooks/useMixtape";

const Mixtape: FunctionComponent = (): JSX.Element => {
  const { mixtapeTitles, handleTapeSet, notificationImages, backgroundImages } =
    useMixtape();
  return (
    <div className="relative w-full h-full row-start-2 bg-white grid grid-flow-col auto-cols-auto">
      <Interface
        title={"Mixtape Maker"}
        tapeTitles={mixtapeTitles}
        handleTapeSet={handleTapeSet}
        images={notificationImages}
        backgroundImages={backgroundImages}
        mixtape={true}
      />
    </div>
  );
};

export default Mixtape;
