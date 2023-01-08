import React, { FunctionComponent } from "react";
import { ImCross } from "react-icons/im";
import { useDispatch } from "react-redux";
import { setGetProfileModal } from "../../../../redux/reducers/getProfileModalSlice";

const GetProfileModal: FunctionComponent = (): JSX.Element | null => {
  const dispatch = useDispatch();
  return (
    <div className="inset-0 justify-center fixed z-20 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div className="relative w-[40vw] h-fit col-start-1 place-self-center bg-offBlue/70 rounded-lg">
        <div className="relative w-full row-start-2 h-fit rounded-xl grid grid-flow-col auto-cols-auto">
          <div className="relative w-full h-full col-start-1 rounded-xl place-self-center">
            <div className="relative w-full h-full grid grid-flow-row auto-rows-auto gap-10 pb-8">
              <div className="relative w-fit h-fit row-start-1 self-center justify-self-end pr-3 pt-3 cursor-pointer">
                <ImCross
                  color="white"
                  size={15}
                  onClick={() => dispatch(setGetProfileModal(false))}
                />
              </div>
              <div className="relative w-full h-fit row-start-2 grid grid-flow-col auto-cols-auto px-4">
                <div className="relative w-fit h-fit font-dosis text-white text-xl place-self-center text-center">
                  Own Your Digital Roots. <br />
                  Claim A Lens Handle to Sign In to The Dial.
                </div>
              </div>
              <a
                target="_blank"
                rel="noreferrer"
                href={"https://claim.lens.xyz"}
                className="relative w-fit h-10 col-start-1 grid grid-flow-col auto-cols-auto px-4 row-start-3 cursor-pointer active:scale-95 bg-lensLight/80 font-dosis text-white rounded-md place-self-center"
              >
                <div className="relative w-fit h-fit place-self-center col-start-1 text-lg px-3 py-1.5 text-center">
                  Claim Handle
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetProfileModal;
