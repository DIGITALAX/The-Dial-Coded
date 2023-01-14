import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { INFURA_GATEWAY } from "../../../../../lib/lens/constants";
import { Draft, DraftsProps } from "./../types/canvas.types";

const Drafts: FunctionComponent<DraftsProps> = ({
  draftCanvases,
  handleShowDraft,
  createAuthProvider,
  client,
  draftsLoading,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit grid grid-flow-row auto-rows-auto pt-3 overflow-x-scroll">
      {!client ? (
        <div
          className="relative w-24 h-10 grid grid-flow-col auto-cols-auto text-black font-dosis text-base bg-white rounded-md px-2 py-1 cursor-pointer active:scale-95"
          onClick={() => createAuthProvider()}
        >
          {!draftsLoading ? (
            <div className="relative w-fit h-fit col-start-1 place-self-center">
              View Drafts
            </div>
          ) : (
            <div className="relative w-fit h-fit col-start-1 place-self-center animate-spin">
              <AiOutlineLoading size={10} color="black" />
            </div>
          )}
        </div>
      ) : (
        <div className="relative w-fit h-fit grid grid-flow-col auto-cols-auto gap-2 col-start-1">
          {draftCanvases?.map((draft: Draft, index: number) => {
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
      )}
    </div>
  );
};

export default Drafts;
