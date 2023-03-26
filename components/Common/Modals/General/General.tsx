import { FunctionComponent } from "react";
import { ImCross } from "react-icons/im";
import { useDispatch } from "react-redux";
import { setInsufficientFunds } from "../../../../redux/reducers/insufficientFunds";
import { GeneralProps } from "../../types/common.types";

const General: FunctionComponent<GeneralProps> = ({
  inputText,
}): JSX.Element => {
  const dispatch = useDispatch();
  return (
    <div className="inset-0 justify-center fixed z-50 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div
        className="relative w-full md:w-[40vw] h-fit col-start-1 place-self-center rounded-lg p-px"
        id="modal"
      >
        <div className="relative w-full h-full bg-dG rounded-lg">
          <div className="relative w-full row-start-2 h-fit rounded-xl grid grid-flow-col auto-cols-auto">
            <div className="relative w-full h-full col-start-1 rounded-xl place-self-center">
              <div className="relative w-full h-full grid grid-flow-row auto-rows-auto gap-10 pb-8">
                <div className="relative w-fit h-fit row-start-1 self-center justify-self-end pr-3 pt-3 cursor-pointer">
                  <ImCross
                    color="white"
                    size={15}
                    onClick={() => dispatch(setInsufficientFunds(""))}
                  />
                </div>
                <div className="relative w-full h-fit row-start-2 grid grid-flow-col auto-cols-auto px-4">
                  <div className="relative w-fit h-fit font-dosis text-white text-xl place-self-center text-center">
                    {inputText}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default General;
