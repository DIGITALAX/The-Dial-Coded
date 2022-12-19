import { FunctionComponent } from "react";
import { ImCross } from "react-icons/im";
import { useDispatch } from "react-redux";
import { setSignIn } from "../../../../redux/reducers/signInSlice";
import useLensSignIn from "../../Auth/hooks/useLensSignIn";
import { AiOutlineLoading } from "react-icons/ai";

const SignInModal: FunctionComponent = (): JSX.Element => {
  const dispatch = useDispatch();
  const { handleLensLogin, isLoading } = useLensSignIn();
  return (
    <div className="inset-0 justify-center fixed z-50 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div className="relative w-[40vw] h-fit col-start-1 place-self-center bg-offBlue/70 rounded-lg">
        <div className="relative w-full row-start-2 h-fit rounded-xl grid grid-flow-col auto-cols-auto">
          <div className="relative w-full h-full col-start-1 rounded-xl place-self-center">
            <div className="relative w-full h-full grid grid-flow-row auto-rows-auto gap-10 pb-8">
              <div className="relative w-fit h-fit row-start-1 self-center justify-self-end pr-3 pt-3 cursor-pointer">
                <ImCross
                  color="white"
                  size={15}
                  onClick={() => dispatch(setSignIn(false))}
                />
              </div>
              <div className="relative w-full h-fit row-start-2 grid grid-flow-col auto-cols-auto px-4">
                <div className="relative w-fit h-fit font-dosis text-white text-xl place-self-center text-center">
                  Connect With Your Lens Profile Account.
                </div>
              </div>
              <div
                className="relative w-32 h-10 col-start-1 grid grid-flow-col auto-cols-auto px-4 row-start-3 cursor-pointer active:scale-95 bg-lensLight/80 font-dosis text-white rounded-md place-self-center"
                onClick={() => handleLensLogin()}
              >
                <div
                  className={`relative w-fit h-fit place-self-center col-start-1 text-lg px-3 py-1.5 text-center ${
                    isLoading && "animate-spin"
                  }`}
                >
                  {isLoading ? (
                    <AiOutlineLoading color="white" size={20} />
                  ) : (
                    "Sign In"
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInModal;
