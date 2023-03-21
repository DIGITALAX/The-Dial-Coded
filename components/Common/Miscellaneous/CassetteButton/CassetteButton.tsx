import { useRouter } from "next/router";
import { FormEvent, FunctionComponent } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { IoMdArrowDropdown } from "react-icons/io";
import { useDispatch } from "react-redux";
import { setAccountPage } from "../../../../redux/reducers/accountPageSlice";
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
  keyExists,
  canvasType,
  synthElement,
  localRunning,
  apiType,
  clickable,
  clickChange,
  max,
  min,
  dropDown,
  setDropOpen,
  dropOpen,
  scroll,
  width,
}): JSX.Element => {
  const router = useRouter();
  const dispatch = useDispatch();
  return (
    <div
      className={`z-1 ${position} bottom-${bottom} right-${right} h-fit rounded-lg border-black border-2 ${
        ((!canvasType &&
          keyExists &&
          handleSend &&
          !loading &&
          value &&
          value?.length > 0) ||
          (!keyExists && handleSend) ||
          (canvasType &&
            keyExists &&
            handleSend &&
            !loading &&
            value &&
            value?.length > 0 &&
            synthElement)) &&
        "cursor-pointer active:scale-95"
      } bg-black min-w-[5rem] ${clickable && !scroll && "max-w-[5rem]"} ${
        !width ? (scroll ? "w-full" : "w-fit") : `w-${width}`
      }`}
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
            className={`relative w-fit col-start-1 h-fit place-self-center grid grid-flow-cols auto-cols-auto text-center whitespace-nowrap text-white/80 font-sats px-3 py-1 text-${textSize} bg-transparent ${
              loading && "animate-spin"
            } ${dropDown && "cursor-pointer"}`}
            onClick={
              dropDown
                ? () => {
                    setDropOpen && setDropOpen(!dropOpen);
                  }
                : apiType
                ? keyExists
                  ? () =>
                      handleSend &&
                      value &&
                      value?.length > 0 &&
                      handleSend(apiType!)
                  : handleSend
                  ? () => {
                      router.push("/#Account");
                      dispatch(setAccountPage("synth api"));
                    }
                  : () => {}
                : localRunning
                ? () =>
                    handleSend &&
                    value &&
                    value?.length > 0 &&
                    handleSend(apiType!)
                : handleSend
                ? () => {
                    router.push("/#Account");
                    dispatch(setAccountPage("synth api"));
                  }
                : () => {}
            }
          >
            {loading ? (
              <AiOutlineLoading color="white" size={15} />
            ) : clickable ? (
              <input
                value={text}
                disabled={!clickable}
                placeholder={text}
                type={"number"}
                className={`relative w-full h-fit text-center whitespace-nowrap text-white/80 font-sats text-${textSize} bg-transparent`}
                onChange={
                  clickChange && clickable
                    ? (e: FormEvent) =>
                        clickChange(
                          max && Number((e.target as any).value) > Number(max)
                            ? max
                            : min &&
                              Number((e.target as any).value) < Number(min)
                            ? min
                            : (e.target as any).value
                        )
                    : () => {}
                }
              />
            ) : (
              text
            )}
            {dropDown && (
              <div className="relative w-fit h-fit col-start-2 self-center pl-1">
                <IoMdArrowDropdown color="#FFDE90" size={15} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CassetteButton;
