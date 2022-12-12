import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { ImCross } from "react-icons/im";
import { useDispatch } from "react-redux";
import { setPublication } from "../../../../redux/reducers/publicationSlice";

const PublicationModal: FunctionComponent = (): JSX.Element => {
  const dispatch = useDispatch();
  return (
    <div className="inset-0 justify-center fixed z-30 bg-opacity-50 backdrop-blur-md overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div className="relative w-[60vw] h-fit col-start-1 place-self-center bg-offBlue/70 rounded-md px-4 py-3">
        <div className="relative w-full row-start-2 h-fit rounded-xl grid grid-flow-col auto-cols-auto">
          <div className="relative w-full h-full col-start-1 rounded-xl place-self-center">
            <div
              className="relative w-full h-full grid grid-flow-row auto-rows-auto gap-4
            "
            >
              <div className="relative w-fit h-fit row-start-1 self-center justify-self-end pr-3 pt-3 cursor-pointer">
                <ImCross
                  color="white"
                  size={15}
                  onClick={() => dispatch(setPublication(false))}
                />
              </div>
              <div className="relative w-full h-full col-start-1 grid grid-flow-col auto-cols-auto pb-4 gap-6 row-start-2">
                <div
                  id="radialPinkBorder"
                  className="relative w-full h-full grid grid-flow-col auto-cols-auto p-1 rounded-xl"
                >
                  <textarea
                    style={{ resize: "none" }}
                    placeholder="Have something to share..."
                    className="relative w-full h-32 overflow-y-scroll col-start-1 bg-white/80 rounded-xl grid grid-flow-col auto-cols-auto cursor-text active:opacity-80 text-offBlack font-dosis text-md p-2 place-self-center"
                  ></textarea>
                </div>
              </div>
              <div className="relative h-8 row-start-3 grid grid-flow-col auto-cols-auto w-20 rounded-md px-2 py-1 bg-white text-black font-dosis cursor-pointer active:scale-95 justify-self-end self-center">
                <div className="relative w-fit h-fit col-start-1 place-self-center text-sm">
                  POST
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicationModal;
