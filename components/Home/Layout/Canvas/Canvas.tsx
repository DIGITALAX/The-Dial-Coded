import { useConnectModal } from "@rainbow-me/rainbowkit";
import { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSignIn } from "../../../../redux/reducers/signInSlice";
import { RootState } from "../../../../redux/store";

const Canvas: FunctionComponent = (): JSX.Element => {
  const profile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile
  );
  const isConnected = useSelector(
    (state: RootState) => state.app.walletConnectedReducer.value
  );
  const dispatch = useDispatch();
  const { openConnectModal } = useConnectModal();
  if (!profile || !isConnected) {
    return (
      <div className="relative w-full h-full row-start-2 grid grid-flow-row auto-rows-auto bg-white pt-10">
        <div className="relative col-start-1 w-[95%] h-[80vw] bg-gradient-to-r from-offBlack via-black/70 to-offBlack rounded-lg grid grid-flow-col auto-cols-auto p-24 row-start-1 place-self-center">
          <div
            id="canvas"
            className="relative w-full h-full col-start-1 rounded-lg grid grid-flow-col auto-cols-auto"
          >
            <div className="relative w-full h-full bg-white/90 grid grid-flow-col auto-cols-auto">
              <div
                className="relative w-fit h-fit place-self-center font-dosis text-offBlack text-md cursor-pointer"
                onClick={
                  !isConnected
                    ? openConnectModal
                    : () => dispatch(setSignIn(true))
                }
              >
                Please Connect to Lens to use the Canvas.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full row-start-2 grid grid-flow-row auto-rows-auto bg-white pt-10">
      <div className="relative col-start-1 w-[95%] h-[80vw] bg-gradient-to-r from-offBlack via-black/70 to-offBlack rounded-lg grid grid-flow-col auto-cols-auto p-24 row-start-1 place-self-center">
        <div
          id="canvas"
          className="relative w-full h-full col-start-1 rounded-lg grid grid-flow-col auto-cols-auto"
        >
          <div className="relative w-full h-full bg-white/90"></div>
        </div>
      </div>
    </div>
  );
};

export default Canvas;
