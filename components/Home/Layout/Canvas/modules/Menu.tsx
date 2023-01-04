import { FunctionComponent } from "react";
import { IoOptionsOutline } from "react-icons/io5";
import DrawOptions from "./DrawOptions";
import { MenuProps } from "../types/canvas.types";

const Menu: FunctionComponent<MenuProps> = ({
  setShowDrawOptions,
  showDrawOptions,
  hex,
  setHex,
}): JSX.Element => {
  return (
    <div className="absolute w-fit h-fit row-start-1 grid grid-flow-row auto-rows-auto justify-self-end self-start p-2 gap-2 z-10">
      <div
        className="relative w-12 h-12 rounded-md bg-white grid grid-flow-col auto-cols-auto drop-shadow-lg cursor-pointer active:scale-95 justify-self-end self-start"
        onClick={() => setShowDrawOptions(!showDrawOptions)}
      >
        <div className="col-start-1 relative w-fit h-fit place-self-center">
          <IoOptionsOutline color="black" size={20} />
        </div>
      </div>
      {showDrawOptions && <DrawOptions hex={hex} setHex={setHex} />}
    </div>
  );
};

export default Menu;
