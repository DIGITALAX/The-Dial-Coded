import { FunctionComponent } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { CassetteButton } from "../../types/common.types";

const CassetteButton: FunctionComponent<CassetteButton> = ({
  text,
  textSize,
  right,
  bottom,
  position,
  loading,
  handleSend,
  value,
}): JSX.Element => {
  return (
    <div
      className={`z-1 ${position} bottom-${bottom} right-${right} w-20 h-fit rounded-lg border-black border-2 ${
        handleSend &&
        !loading &&
        value &&
        value?.length > 0 &&
        "cursor-pointer active:scale-95"
      } bg-black`}
    >
      <div
        className="relative w-full h-full p-px rounded-md backdrop-opacity-10"
        id="catch"
      >
        <div
          className="relative w-full h-full grid grid-flow-col auto-cols-auto rounded-md content-center"
          id="mass"
        >
          <div
            className={`relative w-fit col-start-1 h-fit place-self-center text-white/80 font-sats px-3 py-1 text-${textSize} ${
              loading && "animate-spin"
            }`}
            onClick={() =>
              handleSend && value && value?.length > 0 && handleSend()
            }
          >
            {loading ? <AiOutlineLoading color="white" size={15} /> : text}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CassetteButton;
