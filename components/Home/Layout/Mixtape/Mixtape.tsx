import { FunctionComponent } from "react";
import Interface from "../../../Common/Interface/Interface";
import useMixtape from "./hooks/useMixtape";

const Mixtape: FunctionComponent = (): JSX.Element => {
  const {
    handleTapeSet,
    notificationImages,
    message,
    mixtapeBackgrounds,
    mixtapeTitles,
    getMixLoading,
    getMoreMixtapes
  } = useMixtape();
  return (
    <div className="relative w-full h-full row-start-2 bg-white grid grid-flow-col auto-cols-auto">
      <Interface
        title={"Mixtape Maker"}
        tapeTitles={mixtapeTitles}
        handleTapeSet={handleTapeSet}
        images={notificationImages}
        backgroundImages={mixtapeBackgrounds}
        mixtape={true}
        message={message}
        loader={getMixLoading}
        more={getMoreMixtapes}
      />
    </div>
  );
};

export default Mixtape;
