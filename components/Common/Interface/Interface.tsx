import { FunctionComponent } from "react";
import Box from "../Miscellaneous/Box";
import { InterfaceProps } from "../types/common.types";
import MainDisplay from "./MainDisplay";

const Interface: FunctionComponent<InterfaceProps> = ({
  title,
  tapeTitles,
  handleTapeSet,
  images,
  message,
  sideImage,
  backgroundImages,
  mixtape,
  loader,
  more
}): JSX.Element => {
  return (
    <div className="relative w-full h-full col-start-1 grid grid-flow-col auto-cols-auto pt-10">
      <div className="relative col-start-1 w-[95%] h-full bg-gradient-to-r from-offBlack via-black/70 to-offBlack rounded-lg grid grid-flow-col auto-cols-auto pt-4 px-4 pb-10 gap-4 justify-self-center">
        <div className="relative w-fit h-full col-start-1 grid grid-flow-row auto-rows-auto gap-8 justify-between">
          <div className="relative row-start-1 place-self-start w-fit h-fit grid grid-flow-row auto-rows-auto gap-6">
            <Box
              image={"QmdBxkJrAmEbn3dFTubcdaRToXnjwnz8ZqHp27p9mz1cDm"}
              col={"1"}
              row={"1"}
              self={"start"}
              justify={"start"}
              border
            />
            <Box
              image={"QmYC8rKZWkZFVtEBJq9mEPVYev5s7ckYkivEKVrobSbxsf"}
              col={"1"}
              row={"2"}
              self={"start"}
              justify={"start"}
              bgColor
              border
            />
          </div>
          <Box
            image={"QmVLBNJAC6MQmB3Z35sd17T9hbrK9zksRk4o7GRdfYiV89"}
            col={"1"}
            row={"2"}
            self={"end"}
            justify={"start"}
            contain
            rounded
          />
        </div>
        <div className="relative w-[80vw] h-fit col-start-2 grid grid-flow-row auto-rows-auto gap-6 place-self-center">
          <div className="relative row-start-1 w-full h-fit grid grid-flow-col auto-cols-auto self-start justify-between">
            <Box
              image={"QmdiQ9NdH95kSgysocBj7uKbsVjPujPiavozihXRPYt1g5"}
              col={"1"}
              row={"1"}
              self={"center"}
              justify={"start"}
              bgColor
              border
            />
            <Box
              image={"QmTf9xQZfcCX6ThsgwbuxC2cSYDNUiVzD5RKRqoBGkhjbo"}
              col={"2"}
              row={"1"}
              self={"center"}
              justify={"end"}
              bgColor
              border
            />
          </div>
          <MainDisplay
            tapeTitles={tapeTitles}
            row={"2"}
            title={title}
            handleTapeSet={handleTapeSet}
            images={images}
            message={message}
            sideImage={sideImage}
            backgroundImages={backgroundImages}
            mixtape={mixtape}
            loader={loader}
            more={more}
          />
        </div>
        <div className="relative w-fit h-full justify-between col-start-3 grid grid-flow-row auto-rows-auto gap-8 justify-self-end">
          <Box
            image={"Qme799mCrdfV5F35gbQzfresp8b6MZva8M72ydXoA9APkr"}
            col={"1"}
            row={"1"}
            self={"start"}
            justify={"end"}
            bgColor
            border
          />
          <div className="relative row-start-2 place-self-end w-fit h-fit grid grid-flow-row auto-rows-auto gap-6">
            <Box
              image={"Qmdf4iGgMMrj4gAQy7DDaaDZEKet3DdxQrXwJkXYoSePK7"}
              col={"1"}
              row={"1"}
              self={"end"}
              justify={"end"}
              rounded
              border
            />
            <Box
              image={"QmdBxkJrAmEbn3dFTubcdaRToXnjwnz8ZqHp27p9mz1cDm"}
              col={"1"}
              row={"2"}
              self={"end"}
              justify={"end"}
              border
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interface;
