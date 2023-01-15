import { FormEvent, FunctionComponent } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { DraftsProps } from "./../types/canvas.types";

const Drafts: FunctionComponent<DraftsProps> = ({
  draftsLoading,
  loadDraft,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit grid grid-flow-row auto-rows-auto pt-3 overflow-x-scroll">
      {!draftsLoading ? (
        <label className="relative w-24 h-10 grid grid-flow-col auto-cols-auto text-black font-dosis text-base bg-white rounded-md px-2 py-1 cursor-pointer active:scale-95">
          <div className="relative w-fit h-fit col-start-1 place-self-center">
            Load Draft
          </div>
          <input
            type="file"
            accept="application/JSON"
            hidden
            id="files"
            multiple={false}
            name="drafts"
            className="caret-transparent"
            onChange={(e: FormEvent) => {
              loadDraft(e);
            }}
          />
        </label>
      ) : (
        <div className="relative w-fit h-fit col-start-1 place-self-center animate-spin">
          <AiOutlineLoading size={10} color="black" />
        </div>
      )}
    </div>
  );
};

export default Drafts;
