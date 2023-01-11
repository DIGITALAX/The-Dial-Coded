import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../../lib/lens/constants";
import { Draft, DraftsProps } from "./../types/canvas.types";

const Drafts: FunctionComponent<DraftsProps> = ({
  draftCanvases,
  handleShowDraft,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit grid grid-flow-row auto-rows-auto pt-2 overflow-x-scroll">
      <div className="relative w-fit h-fit grid grid-flow-col auto-cols-auto gap-2 col-start-1">
        {draftCanvases.map((draft: Draft, index: number) => {
          return (
            <div
              key={index}
              className="relative w-10 h-10 border border-white rounded-md bg-spots grid grid-flow-col auto-cols-auto cursor-pointer active:scale-95"
              onClick={() => handleShowDraft(draft)}
            >
              <div className="relative w-full h-full col-start-1 flex">
                <Image
                  src={`${INFURA_GATEWAY}/ipfs/${
                    String(draft?.image)?.split("://")[1]
                  }`}
                  className="flex rounded-md"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Drafts;
