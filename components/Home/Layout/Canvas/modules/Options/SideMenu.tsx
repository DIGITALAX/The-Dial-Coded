import { FunctionComponent } from "react";
import { IoOptionsOutline } from "react-icons/io5";
import SideOptions from "./SideOptions";
import { SideMenuProps } from "../../types/canvas.types";

const SideMenu: FunctionComponent<SideMenuProps> = ({
  setShowSideDrawOptions,
  showSideDrawOptions,
  handleSave,
  draftBoard,
  setDraftBoard,
}): JSX.Element => {
  return (
    <div className="absolute w-fit h-fit col-start-1 grid grid-flow-row auto-rows-auto justify-self-end self-start p-3 gap-2 z-10">
      <div
        className="relative w-12 h-12 rounded-md bg-white grid grid-flow-col auto-cols-auto drop-shadow-lg cursor-pointer active:scale-95 justify-self-end self-start"
        onClick={() => setShowSideDrawOptions(!showSideDrawOptions)}
      >
        <div className="col-start-1 relative w-fit h-fit place-self-center">
          <IoOptionsOutline color="black" size={20} />
        </div>
      </div>
      {showSideDrawOptions && (
        <SideOptions
          handleSave={handleSave}
          draftBoard={draftBoard}
          setDraftBoard={setDraftBoard}
        />
      )}
    </div>
  );
};

export default SideMenu;
